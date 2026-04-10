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

        var order = new Order
        {
            UserId = userId,
            AddressId = orderDto.AddressId,
            Note = orderDto.Note,
            Status = "Pending",
            CreatedAt = DateTime.Now,
            ShippingFee = 0, // In real app, calculate based on address
            TotalAmount = cart.CartItems.Sum(i => i.Quantity * i.Product!.Price)
        };

        foreach (var item in cart.CartItems)
        {
            order.OrderDetails.Add(new OrderDetail
            {
                ProductId = item.ProductId,
                Price = item.Product!.Price,
                Quantity = item.Quantity
            });
        }

        _context.Orders.Add(order);
        cart.CartItems.Clear(); // Clear cart after order
        await _context.SaveChangesAsync();

        return _mapper.Map<OrderReadDto>(order);
    }
}
