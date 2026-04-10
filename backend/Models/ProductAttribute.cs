using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ProductAttribute
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }

    [MaxLength(100)]
    public string? AttributeName { get; set; }

    [MaxLength(255)]
    public string? AttributeValue { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product? Product { get; set; }
}
