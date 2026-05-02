using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<CustomerReadDto>> GetCustomersAsync();
    Task<CustomerDetailDto?> GetCustomerDetailsAsync(int id);
    Task<bool> ToggleUserStatusAsync(int id);
    Task<bool> ResetPasswordAsync(int id, string newPassword);
    Task<UserDto?> GetProfileAsync(int userId);
    Task<bool> UpdateProfileAsync(int userId, UserProfileUpdateDto profileDto);
}
