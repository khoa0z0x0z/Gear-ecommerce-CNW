using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Services;

public class ChatbotService : IChatbotService
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ChatbotService(AppDbContext context, HttpClient httpClient, IConfiguration configuration)
    {
        _context = context;
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] ?? string.Empty;
    }

    public async Task<ChatResponseDto> ProcessUserMessageAsync(ChatRequestDto request)
    {
        if (string.IsNullOrEmpty(_apiKey) || _apiKey == "YOUR_GEMINI_API_KEY_HERE")
        {
            return new ChatResponseDto { AiMessage = "Xin lỗi, tính năng AI tạm thời đang bảo trì (Missing API Key)." };
        }

        // TỐI ƯU HÓA TỐC ĐỘ (SINGLE-PASS RAG):
        var allProducts = await _context.Products
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .Include(p => p.ProductAttributes)
            .Where(p => p.IsActive)
            .ToListAsync();

        var catalogSummaryJson = JsonSerializer.Serialize(allProducts.Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            Category = p.Category?.Name,
            Attributes = p.ProductAttributes?.Select(a => new { a.AttributeName, a.AttributeValue })
        }));

        var singlePassPrompt = @$"
        Bạn là chuyên gia tư vấn cấp cao tên là KAT Chat.
        Câu hỏi khách hàng: '{request.Message}'
        Bản đồ toàn bộ sản phẩm cửa hàng (JSON): {catalogSummaryJson}

        CHỈ THỊ QUAN TRỌNG:
        1. Hãy tìm kiếm trong mảng JSON trên và chọn ra TỐI ĐA 3 sản phẩm phù hợp nhất với yêu cầu.
        2. Sinh ra một câu nói tự nhiên, xưng 'Mình' hoặc 'KAT Chat' (Không xưng là AI), tư vấn CHI TIẾT lý do hợp lý cấu hình dựa trên [Attributes].
        3. TUYỆT ĐỐI BẮT BUỘC bạn phải trả về định dạng JSON thuần túy (KHÔNG CÓ DẤU ```json hay text bên ngoài), với cấu trúc chính xác sau:
        {{
            ""aiMessage"": ""(Câu văn tư vấn thân thiện của bạn, khuyên khách click vào sản phẩm bên dưới. Rỗng nếu không hiểu câu hỏi)"",
            ""recommendedProductIds"": [ID1, ID2, ID3] // Mảng số nguyên chứa ID các sản phẩm bạn khuyên dùng. Rỗng nếu không có.
        }}
        ";

        var rawLlmResponse = await CallGeminiAsync(singlePassPrompt);
        
        var responseDto = new ChatResponseDto();
        try
        {
            var cleanedJson = Regex.Replace(rawLlmResponse, @"```(json)?", "").Trim();
            using var doc = JsonDocument.Parse(cleanedJson);
            var root = doc.RootElement;
            
            responseDto.AiMessage = root.GetProperty("aiMessage").GetString() ?? "Xin lỗi, mình chưa tìm được sản phẩm ưng ý.";
            
            var recommendedIds = new List<int>();
            if (root.TryGetProperty("recommendedProductIds", out var idsElement) && idsElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var idElem in idsElement.EnumerateArray())
                {
                    if (idElem.TryGetInt32(out int id)) recommendedIds.Add(id);
                }
            }

            var recommendedProducts = allProducts.Where(p => recommendedIds.Contains(p.Id)).ToList();
            foreach (var p in recommendedProducts)
            {
                responseDto.RecommendedProducts.Add(new RecommendedProductDto
                {
                    Id = p.Id,
                    Name = p.Name ?? string.Empty,
                    Price = p.Price,
                    ImageUrl = p.ProductImages.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? string.Empty,
                    ShortSpecs = string.Join(", ", p.ProductAttributes?.Select(a => a.AttributeValue) ?? Array.Empty<string>())
                });
            }
        }
        catch (Exception)
        {
            responseDto.AiMessage = "Xin lỗi, hệ thống tư vấn đang gặp chút khó khăn khi sắp xếp sản phẩm. Xin bạn hỏi lại nhé!";
        }

        return responseDto;
    }

    private async Task<string> CallGeminiAsync(string prompt)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={_apiKey}";
        
        var payload = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            },
            generationConfig = new
            {
                responseMimeType = "application/json"
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var res = await _httpClient.PostAsync(url, content);
        
        if (!res.IsSuccessStatusCode)
        {
            var errStr = await res.Content.ReadAsStringAsync();
            try { System.IO.File.WriteAllText("gemini_error.txt", errStr); } catch {}
            
            if (res.StatusCode == System.Net.HttpStatusCode.Forbidden)
                return "API Key của bạn đã bị Google khoá (có thể do bị lộ trên GitHub). Vui lòng tạo API Key mới!";
                
            return "Hệ thống đang bận, xin vui lòng thử lại sau.";
        }

        var resJson = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(resJson);
        try
        {
            var usage = doc.RootElement.GetProperty("usageMetadata");
            int promptTokens = usage.GetProperty("promptTokenCount").GetInt32();
            int candidatesTokens = usage.GetProperty("candidatesTokenCount").GetInt32();
            int totalTokens = usage.GetProperty("totalTokenCount").GetInt32();
            
            Console.WriteLine($"\n[GEMINI API USAGE] Prompt: {promptTokens} | Candidate: {candidatesTokens} | Total: {totalTokens}\n");

            return doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString() ?? "";
        }
        catch (Exception ex)
        {
            try { System.IO.File.WriteAllText("gemini_error.txt", $"Parse Exception: {ex.Message}\nRaw: {resJson}"); } catch {}
            return "[Lỗi phân tích cú pháp từ AI]";
        }
    }
}
