using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto registerDto)
    {
        var user = await _authService.RegisterAsync(registerDto);
        if (user == null) return BadRequest("Email already exists");
        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        try
        {
            var loginResponse = await _authService.LoginAsync(loginDto);
            if (loginResponse == null) return Unauthorized(new { message = "Invalid email or password" });
            return Ok(loginResponse);
        }
        catch (Exception ex) when (ex.Message == "ACCOUNT_LOCKED")
        {
            return BadRequest(new { message = "Tài khoản của bạn đã bị khóa." });
        }
    }
}
