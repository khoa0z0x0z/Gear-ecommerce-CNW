using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class WishlistService : IWishlistService
{
    private readonly AppDbContext _context;

    public WishlistService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WishlistReadDto> GetUserWishlistAsync(int userId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
                    .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            // If wishlist doesn't exist, return empty
            return new WishlistReadDto
            {
                UserId = userId,
                Items = new List<WishlistItemDto>()
            };
        }

        return new WishlistReadDto
        {
            Id = wishlist.Id,
            UserId = wishlist.UserId,
            Items = wishlist.WishlistItems.Select(wi => new WishlistItemDto
            {
                Id = wi.Id,
                ProductId = wi.ProductId,
                ProductName = wi.Product?.Name,
                ProductPrice = wi.Product?.Price ?? 0,
                ProductImage = wi.Product?.ProductImages?.FirstOrDefault()?.ImageUrl,
                CreatedAt = wi.CreatedAt
            }).ToList()
        };
    }

    public async Task<bool> AddToWishlistAsync(int userId, int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return false;

        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist { UserId = userId };
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync(); // Save to get WishlistId
        }

        if (!wishlist.WishlistItems.Any(wi => wi.ProductId == productId))
        {
            _context.WishlistItems.Add(new WishlistItem
            {
                WishlistId = wishlist.Id,
                ProductId = productId,
                CreatedAt = DateTime.Now
            });
            await _context.SaveChangesAsync();
        }

        return true;
    }

    public async Task<bool> RemoveFromWishlistAsync(int userId, int productId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null) return false;

        var item = wishlist.WishlistItems.FirstOrDefault(wi => wi.ProductId == productId);
        if (item == null) return false;

        _context.WishlistItems.Remove(item);
        await _context.SaveChangesAsync();

        return true;
    }
}
