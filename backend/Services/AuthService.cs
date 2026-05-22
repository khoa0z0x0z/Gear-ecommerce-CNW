using AutoMapper;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using backend.Helpers;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly JwtHelper _jwtHelper;

    public AuthService(AppDbContext context, IMapper mapper, JwtHelper jwtHelper)
    {
        _context = context;
        _mapper = mapper;
        _jwtHelper = jwtHelper;
    }

    public async Task<UserDto?> RegisterAsync(UserRegisterDto registerDto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            return null;

        var user = _mapper.Map<User>(registerDto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password); 

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return _mapper.Map<UserDto>(user);
    }

    public async Task<LoginResponseDto?> LoginAsync(UserLoginDto loginDto)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        return null;
    if (!user.IsActive)
        throw new Exception("ACCOUNT_LOCKED");
    var token = _jwtHelper.GenerateToken(user);
    var refreshToken = _jwtHelper.GenerateRefreshToken();
    var newRefreshToken = new RefreshToken
    {
        UserId = user.Id,
        Token = refreshToken,
        ExpiryDate = DateTime.UtcNow.AddHours(2),
        IsRevoked = false
    };
    _context.RefreshTokens.Add(newRefreshToken);
    await _context.SaveChangesAsync();
}
    public async Task<LoginResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto requestDto)
    {
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == requestDto.RefreshToken);

        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryDate <= DateTime.UtcNow || storedToken.User == null)
        {
            return null;
        }

        var user = storedToken.User;

        // Generate new tokens
        var newToken = _jwtHelper.GenerateToken(user);
        var newRefreshToken = _jwtHelper.GenerateRefreshToken();

        // Expire the old refresh token
        storedToken.IsRevoked = true;

        // Save new refresh token
        var newStoredRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshToken,
            ExpiryDate = DateTime.UtcNow.AddHours(2),
            IsRevoked = false
        };

        _context.RefreshTokens.Add(newStoredRefreshToken);
        await _context.SaveChangesAsync();

        return new LoginResponseDto
        {
            Token = newToken,
            RefreshToken = newRefreshToken,
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<bool> LogoutAsync(LogoutRequestDto requestDto)
    {
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == requestDto.RefreshToken);

        if (storedToken == null)
        {
            return false;
        }

        _context.RefreshTokens.Remove(storedToken);
        await _context.SaveChangesAsync();

        return true;
    }
}
