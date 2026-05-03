using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Interfaces;
using backend.DTOs;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers()
    {
        return Ok(await _userService.GetCustomersAsync());
    }

    [HttpGet("{id}/details")]
    public async Task<IActionResult> GetCustomerDetails(int id)
    {
        var details = await _userService.GetCustomerDetailsAsync(id);
        if (details == null) return NotFound();
        return Ok(details);
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var success = await _userService.ToggleUserStatusAsync(id);
        if (!success) return NotFound();
        return Ok(new { message = "Status updated successfully" });
    }

    [HttpPut("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(int id, [FromBody] string newPassword)
    {
        var success = await _userService.ResetPasswordAsync(id, newPassword);
        if (!success) return NotFound();
        return Ok(new { message = "Password reset successfully" });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UserUpdateDto updateDto)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) 
            return Unauthorized();
        
        var success = await _userService.UpdateProfileAsync(userId, updateDto);
        if (!success) return BadRequest(new { message = "Update failed. Check your password or if email is taken." });
        
        return Ok(new { message = "Profile updated successfully" });
    }
}
