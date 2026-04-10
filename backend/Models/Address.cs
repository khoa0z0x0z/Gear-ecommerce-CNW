using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Address
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [MaxLength(500)]
    public string? FullAddress { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(100)]
    public string? District { get; set; }

    [MaxLength(100)]
    public string? Ward { get; set; }

    public bool IsDefault { get; set; } = false;

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}
