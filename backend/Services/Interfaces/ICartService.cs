using backend.DTOs;

namespace backend.Services.Interfaces;

public interface ICartService
{
    Task<CartReadDto> GetCartAsync(int userId);
    Task<CartReadDto> AddToCartAsync(int userId, CartItemUpdateDto itemDto);
    Task<CartReadDto> UpdateQuantityAsync(int userId, CartItemUpdateDto itemDto);
    Task<bool> RemoveFromCartAsync(int userId, int productId);
    Task<bool> ClearCartAsync(int userId);
}
