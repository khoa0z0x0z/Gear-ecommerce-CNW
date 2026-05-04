using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

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
            return new WishlistReadDto { UserId = userId };
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
        // Verify product exists
        var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
        if (!productExists) return false;

        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist { UserId = userId };
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
        }

        if (wishlist.WishlistItems.Any(wi => wi.ProductId == productId))
        {
            return true; // Already exists
        }

        var wishlistItem = new WishlistItem
        {
            WishlistId = wishlist.Id,
            ProductId = productId,
            CreatedAt = DateTime.Now
        };

        _context.WishlistItems.Add(wishlistItem);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> RemoveFromWishlistAsync(int userId, int productId)
    {
        var wishlistItem = await _context.WishlistItems
            .FirstOrDefaultAsync(wi => wi.Wishlist.UserId == userId && wi.ProductId == productId);

        if (wishlistItem == null) return false;

        _context.WishlistItems.Remove(wishlistItem);
        return await _context.SaveChangesAsync() > 0;
    }
}
