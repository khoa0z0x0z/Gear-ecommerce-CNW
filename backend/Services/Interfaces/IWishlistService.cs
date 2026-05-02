using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IWishlistService
{
    Task<WishlistReadDto> GetUserWishlistAsync(int userId);
    Task<bool> AddToWishlistAsync(int userId, int productId);
    Task<bool> RemoveFromWishlistAsync(int userId, int productId);
}
