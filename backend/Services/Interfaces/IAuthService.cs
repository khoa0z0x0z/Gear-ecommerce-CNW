using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IAuthService
{
    Task<UserDto?> RegisterAsync(UserRegisterDto registerDto);
    Task<LoginResponseDto?> LoginAsync(UserLoginDto loginDto);
    Task<LoginResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto requestDto);
    Task<bool> LogoutAsync(LogoutRequestDto requestDto);
}
