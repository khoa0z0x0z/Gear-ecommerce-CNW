using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services.Interfaces;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IAuditService _auditService;

    public OrdersController(IOrderService orderService, IAuditService auditService)
    {
        _orderService = orderService;
        _auditService = auditService;
    }

    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        return Ok(await _orderService.GetUserOrdersAsync(UserId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id, UserId);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Checkout(OrderCreateDto orderDto)
    {
        var order = await _orderService.CreateOrderAsync(UserId, orderDto);
        if (order == null) return BadRequest("Cart is empty or invalid");
        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }

    // Admin endpoints
    [HttpGet("all")]
    public async Task<IActionResult> GetAllOrders()
    {
        return Ok(await _orderService.GetAllOrdersAsync());
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        return Ok(await _orderService.GetDashboardStatsAsync());
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var before = await _orderService.GetAdminOrderByIdAsync(id);
        var success = await _orderService.UpdateOrderStatusAsync(id, status);
        if (!success) return NotFound();
        var after = await _orderService.GetAdminOrderByIdAsync(id);

        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "UpdateOrderStatus", "Order", id, before, after);

        return Ok(new { message = "Order status updated successfully" });
    }

    [HttpGet("revenue-stats")]
    public async Task<IActionResult> GetRevenueStats([FromQuery] string type = "month", [FromQuery] int? year = null)
    {
        var stats = await _orderService.GetRevenueStatsAsync(type, year);
        return Ok(stats);
    }
}
