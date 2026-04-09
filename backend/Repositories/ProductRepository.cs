using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories;

public class ProductRepository : IProductRepository
{
    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await Task.FromResult(new List<Product>());
    }
}
