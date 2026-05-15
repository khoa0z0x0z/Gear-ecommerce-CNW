using System.Collections.Generic;

namespace backend.DTOs;

public class CustomerDetailDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<AddressReadDto> Addresses { get; set; } = new();
    public List<OrderReadDto> Orders { get; set; } = new();
}

public class AddressReadDto
{
    public int Id { get; set; }
    public string? FullAddress { get; set; }
    public string? City { get; set; }
    public bool IsDefault { get; set; }
}
