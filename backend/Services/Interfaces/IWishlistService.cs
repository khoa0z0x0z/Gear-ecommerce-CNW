using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IWishlistService
{
    Task<WishlistReadDto> GetWishlistAsync(int userId);
    Task<bool> AddToWishlistAsync(int userId, int productId);
    Task<bool> RemoveFromWishlistAsync(int userId, int productId);
    Task<bool> ClearWishlistAsync(int userId);
    Task<bool> IsProductInWishlistAsync(int userId, int productId);
}
