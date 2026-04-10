using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class WishlistItem
{
    [Key]
    public int Id { get; set; }

    public int WishlistId { get; set; }
    public int ProductId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [ForeignKey("WishlistId")]
    public virtual Wishlist? Wishlist { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product? Product { get; set; }
}
