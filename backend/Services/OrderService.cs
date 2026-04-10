using AutoMapper;
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

    public OrderService(AppDbContext context, IMapper mapper, ICartService cartService)
    {
        _context = context;
        _mapper = mapper;
        _cartService = cartService;
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

        var order = new Order
        {
            UserId = userId,
            AddressId = finalAddressId,
            Note = orderDto.Note,
            Status = "Pending",
            CreatedAt = DateTime.Now,
            ShippingFee = 0,
            TotalAmount = cart.CartItems.Sum(i => i.Quantity * i.Product!.Price)
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
}
