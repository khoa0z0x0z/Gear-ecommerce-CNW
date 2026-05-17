using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IChatbotService
{
    Task<ChatResponseDto> ProcessUserMessageAsync(ChatRequestDto request);
}
