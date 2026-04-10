using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Settings
{
    [Key]
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = string.Empty; // Store, Shipping, Payment, etc.
    public string Description { get; set; } = string.Empty;
}
