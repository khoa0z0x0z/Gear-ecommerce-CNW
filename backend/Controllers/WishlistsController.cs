using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services.Interfaces;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WishlistsController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistsController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        return Ok(await _wishlistService.GetWishlistAsync(UserId));
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToWishlist(WishlistUpdateDto dto)
    {
        var success = await _wishlistService.AddToWishlistAsync(UserId, dto.ProductId);
        if (!success) return BadRequest("Could not add item to wishlist");
        return Ok(new { message = "Item added to wishlist" });
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        var success = await _wishlistService.RemoveFromWishlistAsync(UserId, productId);
        if (!success) return NotFound();
        return Ok(new { message = "Item removed from wishlist" });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearWishlist()
    {
        await _wishlistService.ClearWishlistAsync(UserId);
        return NoContent();
    }
}
