namespace backend.DTOs;

public class WishlistReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<WishlistItemDto> Items { get; set; } = new List<WishlistItemDto>();
}

public class WishlistItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal ProductPrice { get; set; }
    public string? ProductImage { get; set; }
    public DateTime CreatedAt { get; set; }
}
