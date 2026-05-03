using System.Threading.Tasks;

namespace backend.Services.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(int adminId, string adminEmail, string action, string resource, int resourceId, object? before = null, object? after = null);
    }
}
