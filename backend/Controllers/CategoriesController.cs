using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly backend.Services.Interfaces.IAuditService _auditService;

    public CategoriesController(AppDbContext context, IMapper mapper, backend.Services.Interfaces.IAuditService auditService)
    {
        _context = context;
        _mapper = mapper;
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<CategoryDto>>(categories));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();
        return Ok(_mapper.Map<CategoryDto>(category));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CategoryDto categoryDto)
    {
        var category = _mapper.Map<Category>(categoryDto);
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "Create", "Category", category.Id, null, category);

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, _mapper.Map<CategoryDto>(category));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, CategoryDto categoryDto)
    {
        var before = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
        if (before == null) return NotFound();
        var category = await _context.Categories.FindAsync(id);

        category.Name = categoryDto.Name;
        category.Description = categoryDto.Description;

        await _context.SaveChangesAsync();

        int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "Update", "Category", id, before, category);

        return Ok(_mapper.Map<CategoryDto>(category));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound();

        if (category.Products.Any())
        {
            return BadRequest(new { message = "Cannot delete category with associated products. Please move products to another category first." });
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "Delete", "Category", id, category, null);

        return NoContent();
    }
}
