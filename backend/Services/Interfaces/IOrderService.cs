using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderReadDto>> GetUserOrdersAsync(int userId);
    Task<OrderReadDto?> GetOrderByIdAsync(int orderId, int userId);
    Task<OrderReadDto?> GetAdminOrderByIdAsync(int orderId);
    Task<OrderReadDto?> CreateOrderAsync(int userId, OrderCreateDto orderDto);

    // Admin methods
    Task<IEnumerable<OrderReadDto>> GetAllOrdersAsync();
    Task<bool> UpdateOrderStatusAsync(int orderId, string status);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<List<MonthlyRevenueDto>> GetRevenueStatsAsync(string type, int? year);
}
