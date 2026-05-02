using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> GetMyWishlist()
    {
        var wishlist = await _wishlistService.GetUserWishlistAsync(UserId);
        return Ok(wishlist);
    }

    [HttpPost("{productId}")]
    public async Task<IActionResult> AddToWishlist(int productId)
    {
        var success = await _wishlistService.AddToWishlistAsync(UserId, productId);
        if (!success) return NotFound(new { message = "Product not found or failed to add" });
        return Ok(new { message = "Added to wishlist" });
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        var success = await _wishlistService.RemoveFromWishlistAsync(UserId, productId);
        if (!success) return NotFound(new { message = "Item not found in wishlist" });
        return Ok(new { message = "Removed from wishlist" });
    }
}
