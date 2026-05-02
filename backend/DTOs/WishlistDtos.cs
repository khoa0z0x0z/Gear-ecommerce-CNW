namespace backend.DTOs;

public class WishlistReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<WishlistItemReadDto> Items { get; set; } = new();
}

public class WishlistItemReadDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class WishlistUpdateDto
{
    public int ProductId { get; set; }
}
