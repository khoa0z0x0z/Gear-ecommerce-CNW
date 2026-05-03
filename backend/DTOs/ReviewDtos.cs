namespace backend.DTOs;

public class ReviewReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserAvatarUrl { get; set; }
    public int ProductId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ReviewUpsertDto
{
    public int ProductId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}
