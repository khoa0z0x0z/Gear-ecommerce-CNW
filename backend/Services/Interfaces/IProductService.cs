using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
}
