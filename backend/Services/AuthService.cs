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

        return new LoginResponseDto
        {
            Token = _jwtHelper.GenerateToken(user),
            User = _mapper.Map<UserDto>(user)
        };
    }
}
