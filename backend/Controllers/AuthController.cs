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
        var loginResponse = await _authService.LoginAsync(loginDto);
        if (loginResponse == null) return Unauthorized(new { message = "Invalid email or password" });
        return Ok(loginResponse);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto requestDto)
    {
        var response = await _authService.RefreshTokenAsync(requestDto);

        if (response == null) return Unauthorized(new { message = "Invalid or expired refresh token" });
        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(LogoutRequestDto requestDto)
    {
        var result = await _authService.LogoutAsync(requestDto);
        if (!result) return BadRequest(new { message = "Invalid refresh token" });
        return Ok(new { message = "Logged out successfully" });
    }
}
