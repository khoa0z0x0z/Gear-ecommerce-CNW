using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class RefreshToken
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [MaxLength(500)]
    public string? Token { get; set; }

    public DateTime ExpiryDate { get; set; }

    public bool IsRevoked { get; set; } = false;

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}
