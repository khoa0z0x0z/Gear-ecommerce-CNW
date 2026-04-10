using AutoMapper;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class CartService : ICartService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public CartService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CartReadDto> GetCartAsync(int userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        return _mapper.Map<CartReadDto>(cart);
    }

    public async Task<CartReadDto> AddToCartAsync(int userId, CartItemUpdateDto itemDto)
    {
        var cart = await GetOrCreateCartAsync(userId);
        var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == itemDto.ProductId);

        if (cartItem != null)
        {
            cartItem.Quantity += itemDto.Quantity;
        }
        else
        {
            cart.CartItems.Add(new CartItem { ProductId = itemDto.ProductId, Quantity = itemDto.Quantity });
        }

        await _context.SaveChangesAsync();
        return _mapper.Map<CartReadDto>(cart);
    }

    public async Task<CartReadDto> UpdateQuantityAsync(int userId, CartItemUpdateDto itemDto)
    {
        var cart = await GetOrCreateCartAsync(userId);
        var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == itemDto.ProductId);

        if (cartItem != null)
        {
            cartItem.Quantity = itemDto.Quantity;
            if (cartItem.Quantity <= 0) cart.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        return _mapper.Map<CartReadDto>(cart);
    }

    public async Task<bool> RemoveFromCartAsync(int userId, int productId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);

        if (cartItem == null) return false;

        cart.CartItems.Remove(cartItem);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        cart.CartItems.Clear();
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<CartReadDto> SyncCartAsync(int userId, IEnumerable<CartItemUpdateDto> items)
    {
        var cart = await GetOrCreateCartAsync(userId);
        foreach (var itemDto in items)
        {
            var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == itemDto.ProductId);
            if (cartItem != null)
            {
                cartItem.Quantity += itemDto.Quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem { ProductId = itemDto.ProductId, Quantity = itemDto.Quantity });
            }
        }

        await _context.SaveChangesAsync();
        return _mapper.Map<CartReadDto>(cart);
    }

    private async Task<Cart> GetOrCreateCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }
}
