namespace backend.DTOs;

public class ProductReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public int Sold { get; set; }
}

public class ProductUpsertDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}
