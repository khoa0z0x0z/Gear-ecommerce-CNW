using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IAuthService
{
    Task<UserDto?> RegisterAsync(UserRegisterDto registerDto);
    Task<string?> LoginAsync(UserLoginDto loginDto);
}
