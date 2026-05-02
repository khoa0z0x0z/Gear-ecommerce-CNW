using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductReadDto>> GetAllProductsAsync(int? userId = null);
    Task<ProductReadDto?> GetProductByIdAsync(int id, int? userId = null);
    Task<ProductReadDto> CreateProductAsync(ProductUpsertDto productDto);
    Task<ProductReadDto?> UpdateProductAsync(int id, ProductUpsertDto productDto);
    Task<bool> DeleteProductAsync(int id);
}
