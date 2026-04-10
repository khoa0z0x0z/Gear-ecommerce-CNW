using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderReadDto>> GetUserOrdersAsync(int userId);
    Task<OrderReadDto?> GetOrderByIdAsync(int orderId, int userId);
    Task<OrderReadDto?> CreateOrderAsync(int userId, OrderCreateDto orderDto);

    // Admin methods
    Task<IEnumerable<OrderReadDto>> GetAllOrdersAsync();
    Task<bool> UpdateOrderStatusAsync(int orderId, string status);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}
