using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CustomerReadDto>> GetCustomersAsync()
    {
        var customers = await _context.Users
            .Where(u => u.Role == "Customer")
            .Select(u => new CustomerReadDto
            {
                Id = u.Id,
                Email = u.Email,
                FullName = u.FullName,
                Phone = u.Phone,
                Status = u.IsActive ? "Active" : "Inactive",
                OrderCount = _context.Orders.Count(o => o.UserId == u.Id),
                TotalSpent = _context.Orders.Where(o => o.UserId == u.Id).Sum(o => o.TotalAmount)
            })
            .ToListAsync();

        return customers;
    }

    public async Task<CustomerDetailDto?> GetCustomerDetailsAsync(int id)
    {
        var user = await _context.Users
            .Include(u => u.Addresses)
            .Include(u => u.Orders)
                .ThenInclude(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return null;

        return new CustomerDetailDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Phone = user.Phone,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            Addresses = user.Addresses.Select(a => new AddressReadDto
            {
                Id = a.Id,
                FullAddress = a.FullAddress,
                City = a.City,
                IsDefault = a.IsDefault
            }).ToList(),
            Orders = user.Orders.Select(o => new OrderReadDto
            {
                Id = o.Id,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.CreatedAt
            }).ToList()
        };
    }

    public async Task<bool> ToggleUserStatusAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ResetPasswordAsync(int id, string newPassword)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<UserDto?> GetProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Phone = user.Phone,
            Role = user.Role
        };
    }

    public async Task<bool> UpdateProfileAsync(int userId, UserProfileUpdateDto profileDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        // Update basic info
        user.FullName = profileDto.FullName;
        user.Phone = profileDto.Phone;

        // Handle password update if requested
        if (!string.IsNullOrEmpty(profileDto.NewPassword))
        {
            // Must provide current password to change to a new one
            if (string.IsNullOrEmpty(profileDto.CurrentPassword) || 
                !BCrypt.Net.BCrypt.Verify(profileDto.CurrentPassword, user.PasswordHash))
            {
                throw new Exception("Invalid current password");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(profileDto.NewPassword);
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
