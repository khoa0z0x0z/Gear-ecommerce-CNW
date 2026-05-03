using System;

namespace backend.Models;

public class Notification
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    // Comma-separated roles (e.g., "Admin,Customer") that should see this notification
    public string? VisibleToRoles { get; set; }
    // Comma-separated user IDs for individual visibility (optional)
    public string? VisibleToUserIds { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
