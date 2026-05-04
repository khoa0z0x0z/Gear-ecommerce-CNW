using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Contact
{
    [Key]
    public int Id { get; set; }

    [MaxLength(255)]
    public string? Name { get; set; }

    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(50)]
    public string? Phone { get; set; }

    [MaxLength(1000)]
    public string? Message { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
