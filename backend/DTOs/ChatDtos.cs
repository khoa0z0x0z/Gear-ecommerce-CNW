namespace backend.DTOs;

public class ChatRequestDto
{
    public string Message { get; set; } = string.Empty;
    public string? SessionId { get; set; }
}

public class ChatResponseDto
{
    public string AiMessage { get; set; } = string.Empty;
    public List<RecommendedProductDto> RecommendedProducts { get; set; } = new();
}

public class RecommendedProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ShortSpecs { get; set; } = string.Empty;
}

public class RequirementExtractionDto
{
    public string Intent { get; set; } = string.Empty;
    public string? ProductType { get; set; }
    public string? Purpose { get; set; }
    public decimal? MaxPrice { get; set; }
    public decimal? MinPrice { get; set; }
    public int? MinRAM { get; set; }
    public int? MinCPU { get; set; }
    public bool? RequireGPU { get; set; }
    public string? PreferredBrand { get; set; }
    public string? Storage { get; set; }
    public string? ScreenSize { get; set; }
    public string? OperatingSystem { get; set; }
    public List<string> AdditionalRequirements { get; set; } = new();
}
