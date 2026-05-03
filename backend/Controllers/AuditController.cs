using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController : ControllerBase
{
    // Returns the most recent audit log entries (JSON lines stored in backend/Logs/audit.log)
    [HttpGet("logs")]
    public IActionResult GetLogs([FromQuery] int lines = 200)
    {
        try
        {
            var dir = System.IO.Path.Combine(AppContext.BaseDirectory, "Logs");
            var file = System.IO.Path.Combine(dir, "audit.log");
            if (!System.IO.File.Exists(file)) return Ok(new object[0]);

            var all = System.IO.File.ReadAllLines(file);
            var take = Math.Max(0, Math.Min(lines, all.Length));
            var selected = all.Skip(Math.Max(0, all.Length - take)).ToArray();

            var result = new List<object>();
            foreach (var line in selected)
            {
                try
                {
                    var obj = JsonSerializer.Deserialize<object>(line);
                    result.Add(obj ?? line);
                }
                catch
                {
                    result.Add(line);
                }
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
