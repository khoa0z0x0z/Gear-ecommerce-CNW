using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Interfaces;
using backend.DTOs;
using System.Security.Claims;
// Note: this controller is instrumented to write admin audit logs for actions

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuditService _auditService;

    public UsersController(IUserService userService, IAuditService auditService)
    {
        _userService = userService;
        _auditService = auditService;
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
        // capture before state
        var before = await _userService.GetCustomerDetailsAsync(id);
        var success = await _userService.ToggleUserStatusAsync(id);
        if (!success) return NotFound();
        var after = await _userService.GetCustomerDetailsAsync(id);

        // log admin action
        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "ToggleUserStatus", "User", id, before, after);

        return Ok(new { message = "Status updated successfully" });
    }

    [HttpPut("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(int id, [FromBody] string newPassword)
    {
        var success = await ResetPasswordAndLogAsync(id, newPassword);
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

    private async Task<bool> ResetPasswordAndLogAsync(int id, string newPassword)
    {
        var before = await _userService.GetCustomerDetailsAsync(id);
        var success = await _userService.ResetPasswordAsync(id, newPassword);
        if (!success) return false;
        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var adminId);
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        await _auditService.LogAsync(adminId, adminEmail, "ResetPassword", "User", id, before, null);
        return true;
    }
}
