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
        var token = await _authService.LoginAsync(loginDto);
        if (token == null) return Unauthorized("Invalid email or password");
        return Ok(new { Token = token });
    }
}
