using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int currentUserId = 0;
        int.TryParse(userIdStr, out currentUserId);
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

        var query = _context.Reviews.Include(r => r.User!).Where(r => r.ProductId == productId).AsQueryable();

        if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.IsApproved || r.UserId == currentUserId);
        }

        var list = await query.OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.UserId,
                UserName = r.User != null ? (r.User.FullName ?? r.User.Email) : "",
                UserEmail = r.User != null ? r.User.Email : null,
                r.ProductId,
                r.Rating,
                r.Comment,
                r.IsApproved,
                r.CreatedAt
            })
            .AsEnumerable()
            .Select(x => new ReviewReadDto
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.UserName,
                UserAvatarUrl = x.UserEmail != null ?
                    $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(x.UserName)}&size=64&background=ffffff&color=000" : null,
                ProductId = x.ProductId,
                Rating = x.Rating,
                Comment = x.Comment,
                IsApproved = x.IsApproved,
                CreatedAt = x.CreatedAt
            }).ToList();

        return Ok(list);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(ReviewUpsertDto dto)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out var currentUserId)) return Unauthorized();

        // Enforce one review per user per product
        var exists = await _context.Reviews.AnyAsync(r => r.ProductId == dto.ProductId && r.UserId == currentUserId);
        if (exists)
        {
            return Conflict(new { message = "User has already reviewed this product" });
        }

        var review = new backend.Models.Review
        {
            UserId = currentUserId,
            ProductId = dto.ProductId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            IsApproved = true,
            CreatedAt = DateTime.Now
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var read = new ReviewReadDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = (User.Identity?.Name) ?? string.Empty,
            ProductId = review.ProductId,
            Rating = review.Rating,
            Comment = review.Comment,
            IsApproved = review.IsApproved,
            CreatedAt = review.CreatedAt
        };

        return Ok(read);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ReviewUpsertDto dto)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int currentUserId = 0;
        int.TryParse(userIdStr, out currentUserId);
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

        if (review.UserId != currentUserId && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            return Forbid();

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Updated" });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int currentUserId = 0;
        int.TryParse(userIdStr, out currentUserId);
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

        if (review.UserId != currentUserId && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            return Forbid();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public class ToggleDto { public bool IsApproved { get; set; } }

    [Authorize]
    [HttpPut("{id}/hide")]
    public async Task<IActionResult> Hide(int id, [FromBody] ToggleDto dto)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int currentUserId = 0;
        int.TryParse(userIdStr, out currentUserId);
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

        if (review.UserId != currentUserId && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            return Forbid();

        review.IsApproved = dto.IsApproved;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Updated" });
    }
}
