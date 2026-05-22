using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly backend.Services.Interfaces.IAuditService _auditService;

    public NotificationsController(AppDbContext context, backend.Services.Interfaces.IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Notifications.OrderByDescending(n => n.CreatedAt).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _context.Notifications.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "Create", "Notification", notification.Id, null, notification);

        return CreatedAtAction(nameof(Get), new { id = notification.Id }, notification);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Notification dto)
    {
        var before = await _context.Notifications.AsNoTracking().FirstOrDefaultAsync(n => n.Id == id);
        if (before == null) return NotFound();
        var item = await _context.Notifications.FindAsync(id);

        item.Title = dto.Title;
        item.Message = dto.Message;
        item.VisibleToRoles = dto.VisibleToRoles;
        item.VisibleToUserIds = dto.VisibleToUserIds;
        item.ExpiresAt = dto.ExpiresAt;
        item.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "Update", "Notification", id, before, item);

        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Notifications.FindAsync(id);
        if (item == null) return NotFound();
        _context.Notifications.Remove(item);
        await _context.SaveChangesAsync();

        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "Delete", "Notification", id, item, null);

        return NoContent();
    }

    // Public endpoint to get active notifications visible to the current user (optional userId query)
    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActive([FromQuery] int? userId = null)
    {
        var now = DateTime.Now;
        var items = await _context.Notifications
            .Where(n => n.IsActive && (n.ExpiresAt == null || n.ExpiresAt > now))
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        if (userId.HasValue && userId.Value > 0)
        {
            items = items.Where(n => string.IsNullOrEmpty(n.VisibleToUserIds) || n.VisibleToUserIds.Split(',', StringSplitOptions.RemoveEmptyEntries).Contains(userId.Value.ToString()) || string.IsNullOrEmpty(n.VisibleToRoles)).ToList();
        }
        else
        {
            // only global/public notifications
            items = items.Where(n => string.IsNullOrEmpty(n.VisibleToUserIds) && string.IsNullOrEmpty(n.VisibleToRoles)).ToList();
        }

        return Ok(items);
    }
}
