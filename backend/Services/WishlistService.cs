using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class WishlistService : IWishlistService
{
    private readonly AppDbContext _context;

    public WishlistService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WishlistReadDto> GetWishlistAsync(int userId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p!.ProductImages)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist { UserId = userId };
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
        }

        return new WishlistReadDto
        {
            Id = wishlist.Id,
            UserId = wishlist.UserId,
            Items = wishlist.WishlistItems.Select(i => new WishlistItemReadDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? "Unknown",
                Price = i.Product?.Price ?? 0,
                ImageUrl = i.Product?.ProductImages.FirstOrDefault()?.ImageUrl,
                CreatedAt = i.CreatedAt
            }).ToList()
        };
    }

    public async Task<bool> AddToWishlistAsync(int userId, int productId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist { UserId = userId };
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
        }

        // Check if product already in wishlist (Unique check)
        if (wishlist.WishlistItems.Any(i => i.ProductId == productId))
        {
            return true; // Already exists
        }

        var item = new WishlistItem
        {
            WishlistId = wishlist.Id,
            ProductId = productId,
            CreatedAt = DateTime.Now
        };

        _context.WishlistItems.Add(item);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> RemoveFromWishlistAsync(int userId, int productId)
    {
        var item = await _context.WishlistItems
            .FirstOrDefaultAsync(i => i.Wishlist!.UserId == userId && i.ProductId == productId);

        if (item == null) return false;

        _context.WishlistItems.Remove(item);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ClearWishlistAsync(int userId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null) return true;

        _context.WishlistItems.RemoveRange(wishlist.WishlistItems);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> IsProductInWishlistAsync(int userId, int productId)
    {
        return await _context.WishlistItems
            .AnyAsync(i => i.Wishlist!.UserId == userId && i.ProductId == productId);
    }
}
