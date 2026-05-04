using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await _context.Settings.ToListAsync();
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateRange(List<Settings> settings)
    {
        foreach (var item in settings)
        {
            var existing = await _context.Settings.FindAsync(item.Key);
            if (existing != null)
            {
                existing.Value = item.Value;
                existing.Description = item.Description;
                existing.Group = item.Group;
            }
            else
            {
                _context.Settings.Add(item);
            }
        }
        await _context.SaveChangesAsync();
        return Ok(new { message = "Settings updated successfully" });
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> Get(string key)
    {
        var setting = await _context.Settings.FindAsync(key);
        if (setting == null) return NotFound();
        return Ok(setting);
    }

    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublic()
    {
        var settings = await _context.Settings
            .Where(s => s.Group == "Store" || s.Group == "Shipping")
            .ToListAsync();
        return Ok(settings);
    }
}
