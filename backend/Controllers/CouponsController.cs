using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CouponsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Coupons.OrderByDescending(c => c.CreatedAt).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _context.Coupons.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Coupon coupon)
    {
        if (string.IsNullOrWhiteSpace(coupon.Code)) return BadRequest("Coupon code is required.");
        
        coupon.Code = coupon.Code.Trim();
        var exists = await _context.Coupons.AnyAsync(c => c.Code.ToLower() == coupon.Code.ToLower());
        if (exists) return BadRequest("A coupon with this code already exists.");

        coupon.CreatedAt = DateTime.Now;
        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = coupon.Id }, coupon);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Coupon dto)
    {
        var item = await _context.Coupons.FindAsync(id);
        if (item == null) return NotFound();

        item.Code = dto.Code;
        item.Description = dto.Description;
        item.IsPercentage = dto.IsPercentage;
        item.DiscountValue = dto.DiscountValue;
        item.MaxDiscount = dto.MaxDiscount;
        item.StartAt = dto.StartAt;
        item.ExpiryAt = dto.ExpiryAt;
        item.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Coupons.FindAsync(id);
        if (item == null) return NotFound();
        _context.Coupons.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Public validation endpoint for clients to check coupon and computed discount (optional subtotal query)
    [HttpGet("validate/{code}")]
    [AllowAnonymous]
    public async Task<IActionResult> Validate(string code, [FromQuery] decimal subtotal = 0)
    {
        if (string.IsNullOrWhiteSpace(code)) return BadRequest("Code required");

        var searchCode = code.Trim();

        // Case-insensitive lookup
        var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.IsActive && c.Code != null && EF.Functions.Like(c.Code, searchCode));
        if (coupon == null)
        {
            // try case-insensitive match
            coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.IsActive && c.Code != null && c.Code.ToUpper() == searchCode.ToUpper());
        }
        if (coupon == null) return NotFound();

        var now = DateTime.Now;
        if (coupon.StartAt.HasValue && coupon.StartAt > now) return BadRequest("Coupon not active yet");
        if (coupon.ExpiryAt.HasValue && coupon.ExpiryAt < now) return BadRequest("Coupon expired");

        decimal discount = 0;
        decimal rate = 0;
        var rawValue = coupon.DiscountValue;
        if (coupon.IsPercentage)
        {
            // Support both fraction (0.1) and percentage (10) inputs.
            rate = coupon.DiscountValue <= 1 ? coupon.DiscountValue : coupon.DiscountValue / 100m;
            discount = subtotal * rate;
            if (coupon.MaxDiscount.HasValue && discount > coupon.MaxDiscount.Value) discount = coupon.MaxDiscount.Value;
        }
        else
        {
            discount = coupon.DiscountValue;
        }

        if (discount > subtotal) discount = subtotal;

        // Round to integer (VNĐ) for frontend display
        discount = Math.Floor(discount);

        // Include debug info for developers to inspect computation
        return Ok(new { valid = true, discount, coupon, debug = new { rawValue, rate, subtotal } });
    }

    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActive()
    {
        var now = DateTime.Now;
        var coupons = await _context.Coupons
            .Where(c => c.IsActive 
                        && (c.StartAt == null || c.StartAt <= now) 
                        && (c.ExpiryAt == null || c.ExpiryAt >= now))
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return Ok(coupons);
    }
}
