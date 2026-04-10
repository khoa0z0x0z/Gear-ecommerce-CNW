namespace backend.DTOs;

public class CartReadDto
{
    public int UserId { get; set; }
    public List<CartItemReadDto> Items { get; set; } = new();
    public decimal TotalPrice => Items.Sum(i => i.Price * i.Quantity);
}

public class CartItemReadDto
{
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class CartItemUpdateDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
