using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Services;

public class ProductService : IProductService
{
    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        return await Task.FromResult(new List<ProductDto>());
    }
}
