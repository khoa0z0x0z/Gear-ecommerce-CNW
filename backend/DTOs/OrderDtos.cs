namespace backend.DTOs;

public class OrderReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CustomerName { get; set; }
    public List<OrderDetailReadDto> OrderDetails { get; set; } = new();
}

public class OrderDetailReadDto
{
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class OrderCreateDto
{
    public int AddressId { get; set; }
    public string? Note { get; set; }
    
    // Optional address fields for auto-creation
    public string? City { get; set; }
    public string? FullAddress { get; set; }
    // Optional coupon code to apply during checkout
    public string? CouponCode { get; set; }
}
