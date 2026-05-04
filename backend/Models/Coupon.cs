using System;

namespace backend.Models;

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    // If true, DiscountValue is percentage (0-100); otherwise fixed amount
    public bool IsPercentage { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MaxDiscount { get; set; }
    public DateTime? StartAt { get; set; }
    public DateTime? ExpiryAt { get; set; }
    public bool IsActive { get; set; }
    public int UsageLimit { get; set; } = 0; // 0 means unlimited
    public int UsedCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; }
}
