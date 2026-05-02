using AutoMapper;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ProductService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductReadDto>> GetAllProductsAsync(int? userId = null)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .ToListAsync();
        
        var dtos = _mapper.Map<IEnumerable<ProductReadDto>>(products);

        if (userId.HasValue)
        {
            var wishlistProductIds = await _context.WishlistItems
                .Where(i => i.Wishlist!.UserId == userId.Value)
                .Select(i => i.ProductId)
                .ToListAsync();

            foreach (var dto in dtos)
            {
                dto.IsFavorited = wishlistProductIds.Contains(dto.Id);
            }
        }

        return dtos;
    }

    public async Task<ProductReadDto?> GetProductByIdAsync(int id, int? userId = null)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (product == null) return null;

        var dto = _mapper.Map<ProductReadDto>(product);

        if (userId.HasValue)
        {
            dto.IsFavorited = await _context.WishlistItems
                .AnyAsync(i => i.Wishlist!.UserId == userId.Value && i.ProductId == id);
        }

        return dto;
    }

    public async Task<ProductReadDto> CreateProductAsync(ProductUpsertDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Add Images after Product ID is generated
        if (productDto.ImageUrls != null && productDto.ImageUrls.Any())
        {
            foreach (var (url, index) in productDto.ImageUrls.Select((u, i) => (u, i)))
            {
                _context.ProductImages.Add(new ProductImage
                {
                    ImageUrl = url,
                    IsPrimary = index == 0,
                    ProductId = product.Id
                });
            }
            await _context.SaveChangesAsync();
        }

        return _mapper.Map<ProductReadDto>(product);
    }

    public async Task<ProductReadDto?> UpdateProductAsync(int id, ProductUpsertDto productDto)
    {
        var product = await _context.Products
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return null;

        _mapper.Map(productDto, product);

        // Remove existing images
        var existingImages = _context.ProductImages.Where(i => i.ProductId == id);
        _context.ProductImages.RemoveRange(existingImages);
        await _context.SaveChangesAsync();

        // Add new images
        if (productDto.ImageUrls != null && productDto.ImageUrls.Any())
        {
            foreach (var (url, index) in productDto.ImageUrls.Select((u, i) => (u, i)))
            {
                _context.ProductImages.Add(new ProductImage
                {
                    ImageUrl = url,
                    IsPrimary = index == 0,
                    ProductId = id
                });
            }
            await _context.SaveChangesAsync();
        }

        return _mapper.Map<ProductReadDto>(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        return await _context.SaveChangesAsync() > 0;
    }
}
