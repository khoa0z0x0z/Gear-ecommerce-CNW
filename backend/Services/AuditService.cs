using backend.Services.Interfaces;
using System.Text.Json;

namespace backend.Services;

public class AuditService : IAuditService
{
    private readonly string _logFile;
    private static readonly object _lock = new();

    public AuditService()
    {
        var dir = System.IO.Path.Combine(AppContext.BaseDirectory, "Logs");
        System.IO.Directory.CreateDirectory(dir);
        _logFile = System.IO.Path.Combine(dir, "audit.log");
    }

    public Task LogAsync(int adminId, string adminEmail, string action, string resource, int resourceId, object? before = null, object? after = null)
    {
        var entry = new
        {
            TimestampUtc = DateTime.UtcNow,
            AdminId = adminId,
            AdminEmail = adminEmail,
            Action = action,
            Resource = resource,
            ResourceId = resourceId,
            Before = before,
            After = after
        };

        var line = JsonSerializer.Serialize(entry, new JsonSerializerOptions { WriteIndented = false, DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull });
        lock (_lock)
        {
            System.IO.File.AppendAllText(_logFile, line + Environment.NewLine);
        }
        return Task.CompletedTask;
    }
}
