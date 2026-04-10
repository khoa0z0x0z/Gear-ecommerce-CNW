using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [MaxLength(100)]
    public string? PaymentMethod { get; set; }

    [MaxLength(50)]
    public string? Status { get; set; }

    [MaxLength(255)]
    public string? TransactionId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [ForeignKey("OrderId")]
    public virtual Order? Order { get; set; }
}
