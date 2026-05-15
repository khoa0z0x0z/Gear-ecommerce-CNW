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
        object? diffBefore = before;
        object? diffAfter = after;

        if (before != null && after != null)
        {
            var opts = new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull };
            var bJson = JsonSerializer.SerializeToDocument(before, opts);
            var aJson = JsonSerializer.SerializeToDocument(after, opts);

            var diffB = new System.Collections.Generic.Dictionary<string, object?>();
            var diffA = new System.Collections.Generic.Dictionary<string, object?>();

            foreach (var prop in aJson.RootElement.EnumerateObject())
            {
                if (bJson.RootElement.TryGetProperty(prop.Name, out var bProp))
                {
                    if (prop.Value.GetRawText() != bProp.GetRawText())
                    {
                        var bValue = JsonSerializer.Deserialize<object>(bProp.GetRawText() == "null" ? "{}" : bProp.GetRawText());
                        var aValue = JsonSerializer.Deserialize<object>(prop.Value.GetRawText() == "null" ? "{}" : prop.Value.GetRawText());
                        // Just use raw GetRawText and parse it
                        diffB[prop.Name] = bValue ?? bProp.GetRawText();
                        diffA[prop.Name] = aValue ?? prop.Value.GetRawText();
                    }
                }
                else
                {
                    diffA[prop.Name] = JsonSerializer.Deserialize<object>(prop.Value.GetRawText());
                }
            }

            if (diffA.Count > 0)
            {
                diffBefore = diffB;
                diffAfter = diffA;
            }
            else
            {
                return Task.CompletedTask; // No explicitly tracked fields changed
            }
        }

        var entry = new
        {
            TimestampUtc = DateTime.UtcNow,
            AdminId = adminId,
            AdminEmail = adminEmail,
            Action = action,
            Resource = resource,
            ResourceId = resourceId,
            Before = diffBefore,
            After = diffAfter
        };

        var line = JsonSerializer.Serialize(entry, new JsonSerializerOptions { WriteIndented = false, DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull });
        lock (_lock)
        {
            System.IO.File.AppendAllText(_logFile, line + Environment.NewLine);
        }
        return Task.CompletedTask;
    }
}
