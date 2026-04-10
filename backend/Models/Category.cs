using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Category
{
    [Key]
    public int Id { get; set; }

    [MaxLength(255)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
