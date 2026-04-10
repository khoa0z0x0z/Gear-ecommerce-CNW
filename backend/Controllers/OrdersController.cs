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

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
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
}
