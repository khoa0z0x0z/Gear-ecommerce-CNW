using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactsController(AppDbContext context)
    {
        _context = context;
    }

    public class ContactCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitContact(ContactCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Message))
        {
            return BadRequest(new { message = "Name, Email, and Message are required." });
        }

        var contact = new Contact
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Message = dto.Message,
            CreatedAt = DateTime.Now
        };

        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Contact submitted successfully." });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var contacts = await _context.Contacts.OrderByDescending(c => c.CreatedAt).ToListAsync();
        return Ok(contacts);
    }
}
