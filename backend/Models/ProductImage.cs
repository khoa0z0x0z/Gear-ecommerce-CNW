using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ProductImage
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsPrimary { get; set; } = false;

    [ForeignKey("ProductId")]
    public virtual Product? Product { get; set; }
}
