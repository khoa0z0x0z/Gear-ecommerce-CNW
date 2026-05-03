using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

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

    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        if (UserId == 0) return Unauthorized();
        var wishlist = await _wishlistService.GetUserWishlistAsync(UserId);
        return Ok(wishlist);
    }

    [HttpPost("{productId}")]
    public async Task<IActionResult> AddToWishlist(int productId)
    {
        if (UserId == 0) return Unauthorized();
        var result = await _wishlistService.AddToWishlistAsync(UserId, productId);
        if (result) return Ok(new { message = "Added to wishlist" });
        return BadRequest(new { message = "Failed to add to wishlist" });
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        if (UserId == 0) return Unauthorized();
        var result = await _wishlistService.RemoveFromWishlistAsync(UserId, productId);
        if (result) return Ok(new { message = "Removed from wishlist" });
        return NotFound(new { message = "Item not found in wishlist" });
    }
}
