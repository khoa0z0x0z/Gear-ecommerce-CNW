using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICartService _cartService;
    private readonly ILogger<OrderService> _logger;

    public OrderService(AppDbContext context, IMapper mapper, ICartService cartService, ILogger<OrderService> logger)
    {
        _context = context;
        _mapper = mapper;
        _cartService = cartService;
        _logger = logger;
    }

    public async Task<IEnumerable<OrderReadDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return _mapper.Map<IEnumerable<OrderReadDto>>(orders);
    }

    public async Task<OrderReadDto?> GetOrderByIdAsync(int orderId, int userId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
        return _mapper.Map<OrderReadDto>(order);
    }

    public async Task<OrderReadDto?> CreateOrderAsync(int userId, OrderCreateDto orderDto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.CartItems.Any()) return null;

        int finalAddressId = orderDto.AddressId;

        // If no AddressId provided, create a new address record
        if (finalAddressId == 0)
        {
            if (!string.IsNullOrEmpty(orderDto.FullAddress))
            {
                var newAddress = new Address
                {
                    UserId = userId,
                    FullAddress = orderDto.FullAddress,
                    City = orderDto.City,
                    IsDefault = false
                };
                _context.Addresses.Add(newAddress);
                await _context.SaveChangesAsync();
                finalAddressId = newAddress.Id;
            }
            else
            {
                // Fallback: If no address provided, try to find an existing one for the user
                var existingAddress = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == userId);
                if (existingAddress != null)
                {
                    finalAddressId = existingAddress.Id;
                }
                else
                {
                    // If still 0, it will fail FK. To prevent 500, we could return null.
                    return null; 
                }
            }
        }

        var subtotal = cart.CartItems.Sum(i => i.Quantity * i.Product!.Price);

        // compute discount from coupon if provided
        decimal discountAmount = 0;
        if (!string.IsNullOrWhiteSpace(orderDto.CouponCode))
        {
            var searchCode = orderDto.CouponCode.Trim();
            var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.IsActive && c.Code != null && EF.Functions.Like(c.Code, searchCode));
            if (coupon == null)
            {
                coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.IsActive && c.Code != null && c.Code.ToUpper() == searchCode.ToUpper());
            }
            if (coupon != null)
            {
                var now = DateTime.Now;
                if ((coupon.StartAt == null || coupon.StartAt <= now) && (coupon.ExpiryAt == null || coupon.ExpiryAt >= now))
                {
                    if (coupon.IsPercentage)
                    {
                        var rate = coupon.DiscountValue <= 1 ? coupon.DiscountValue : coupon.DiscountValue / 100m;
                        discountAmount = subtotal * rate;
                        if (coupon.MaxDiscount.HasValue && discountAmount > coupon.MaxDiscount.Value)
                            discountAmount = coupon.MaxDiscount.Value;
                        // Log intermediate values for debugging coupon issues
                        _logger.LogInformation("Coupon compute: code={Code} rawValue={Raw} rate={Rate} subtotal={Subtotal} rawDiscount={RawDiscount}", coupon.Code, coupon.DiscountValue, rate, subtotal, discountAmount);
                    }
                    else
                    {
                        discountAmount = coupon.DiscountValue;
                    }

                    if (discountAmount > subtotal) discountAmount = subtotal;

                    // Prevent negative discount
                    if (discountAmount < 0) discountAmount = 0;

                    // Round down to integer VNĐ
                    discountAmount = Math.Floor(discountAmount);
                    _logger.LogInformation("Coupon final: code={Code} discount={Discount}", coupon.Code, discountAmount);
                }
            }
        }

        var order = new Order
        {
            UserId = userId,
            AddressId = finalAddressId,
            Note = orderDto.Note,
            Status = "Pending",
            CreatedAt = DateTime.Now,
            ShippingFee = orderDto.ShippingFee,
            TotalAmount = subtotal - discountAmount + orderDto.ShippingFee
        };

        foreach (var item in cart.CartItems)
        {
            if (item.Product != null)
            {
                order.OrderDetails.Add(new OrderDetail
                {
                    ProductId = item.ProductId,
                    Price = item.Product.Price,
                    Quantity = item.Quantity
                });

                // Update Stock
                item.Product.Stock -= item.Quantity;
            }
        }

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cart.CartItems); // Clear cart after order
        await _context.SaveChangesAsync();

        return _mapper.Map<OrderReadDto>(order);
    }

    // Admin methods
    public async Task<IEnumerable<OrderReadDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return _mapper.Map<IEnumerable<OrderReadDto>>(orders);
    }

    public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return false;

        order.Status = status;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var stats = new DashboardStatsDto();

        stats.TotalOrders = await _context.Orders.CountAsync();
        stats.TotalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);
        stats.TotalCustomers = await _context.Users.CountAsync();

        // Get top 5 products by quantity sold
        stats.TopProducts = await _context.OrderDetails
            .GroupBy(od => od.Product!.Name)
            .Select(g => new TopProductDto
            {
                Name = g.Key,
                Sold = g.Sum(od => od.Quantity),
                Revenue = g.Sum(od => od.Quantity * od.Price)
            })
            .OrderByDescending(x => x.Sold)
            .Take(5)
            .ToListAsync();

        // Simple monthly revenue for the last 6 months
        var sixMonthsAgo = DateTime.Now.AddMonths(-6);
        stats.RevenueChart = await _context.Orders
            .Where(o => o.CreatedAt >= sixMonthsAgo)
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new MonthlyRevenueDto
            {
                Month = g.Key.Month + "/" + g.Key.Year,
                Revenue = g.Sum(o => o.TotalAmount)
            })
            .ToListAsync();

        return stats;
    }

    public async Task<List<MonthlyRevenueDto>> GetRevenueStatsAsync(string type, int? year)
    {
        if (type == "year")
        {
            // Last 12 years
            var currentYear = DateTime.Now.Year;
            var startYear = currentYear - 11;
            
            var query = await _context.Orders
                .Where(o => o.CreatedAt.Year >= startYear)
                .GroupBy(o => o.CreatedAt.Year)
                .Select(g => new
                {
                    Year = g.Key,
                    Revenue = g.Sum(o => o.TotalAmount)
                })
                .ToListAsync();

            // Fill missing years with 0
            var result = new List<MonthlyRevenueDto>();
            for (int y = startYear; y <= currentYear; y++)
            {
                var match = query.FirstOrDefault(q => q.Year == y);
                result.Add(new MonthlyRevenueDto
                {
                    Month = y.ToString(),
                    Revenue = match?.Revenue ?? 0
                });
            }
            return result;
        }
        else
        {
            // 12 months for specific year
            int targetYear = year ?? DateTime.Now.Year;
            
            var query = await _context.Orders
                .Where(o => o.CreatedAt.Year == targetYear)
                .GroupBy(o => o.CreatedAt.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Revenue = g.Sum(o => o.TotalAmount)
                })
                .ToListAsync();

            var result = new List<MonthlyRevenueDto>();
            for (int m = 1; m <= 12; m++)
            {
                var match = query.FirstOrDefault(q => q.Month == m);
                result.Add(new MonthlyRevenueDto
                {
                    Month = "T" + m,
                    Revenue = match?.Revenue ?? 0
                });
            }
            return result;
        }
    }
}
