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

    public async Task<IEnumerable<ProductReadDto>> GetAllProductsAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .ToListAsync();
        return _mapper.Map<IEnumerable<ProductReadDto>>(products);
    }

    public async Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string term)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(term))
        {
            var search = term.Trim().ToLower();
            query = query.Where(p => 
                p.Name.ToLower().Contains(search) || 
                p.Category.Name.ToLower().Contains(search) ||
                (p.Description != null && p.Description.ToLower().Contains(search))
            );
        }

        var products = await query.ToListAsync();
        return _mapper.Map<IEnumerable<ProductReadDto>>(products);
    }

    public async Task<ProductReadDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == id);
        return _mapper.Map<ProductReadDto>(product);
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

    public async Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string term)
    {
        if (string.IsNullOrWhiteSpace(term))
            return new List<ProductReadDto>();

        var searchTerm = term.ToLower();
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .Where(p => p.Name.ToLower().Contains(searchTerm) || (p.Description != null && p.Description.ToLower().Contains(searchTerm)))
            .ToListAsync();
            
        return _mapper.Map<IEnumerable<ProductReadDto>>(products);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        return await _context.SaveChangesAsync() > 0;
    }
}
