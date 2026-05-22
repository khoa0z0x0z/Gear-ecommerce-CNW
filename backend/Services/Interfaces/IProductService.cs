using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductReadDto>> GetAllProductsAsync();
    Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string term);
    Task<ProductReadDto?> GetProductByIdAsync(int id);
    Task<ProductReadDto> CreateProductAsync(ProductUpsertDto productDto);
    Task<ProductReadDto?> UpdateProductAsync(int id, ProductUpsertDto productDto);
    Task<IEnumerable<ProductReadDto>> SearchProductsAsync(string term);
    Task<bool> DeleteProductAsync(int id);
}
