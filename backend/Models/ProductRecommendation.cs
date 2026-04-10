using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ProductRecommendation
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }
    public int RecommendedProductId { get; set; }
    public double Score { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product? Product { get; set; }

    [ForeignKey("RecommendedProductId")]
    public virtual Product? RecommendedProduct { get; set; }
}
