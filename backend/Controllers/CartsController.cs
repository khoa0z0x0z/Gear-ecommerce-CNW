using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services.Interfaces;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartsController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartsController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        return Ok(await _cartService.GetCartAsync(UserId));
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart(CartItemUpdateDto itemDto)
    {
        return Ok(await _cartService.AddToCartAsync(UserId, itemDto));
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncCart(IEnumerable<CartItemUpdateDto> items)
    {
        return Ok(await _cartService.SyncCartAsync(UserId, items));
    }

    [HttpPut("items")]
    public async Task<IActionResult> UpdateQuantity(CartItemUpdateDto itemDto)
    {
        return Ok(await _cartService.UpdateQuantityAsync(UserId, itemDto));
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveFromCart(int productId)
    {
        var success = await _cartService.RemoveFromCartAsync(UserId, productId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        await _cartService.ClearCartAsync(UserId);
        return NoContent();
    }
}
