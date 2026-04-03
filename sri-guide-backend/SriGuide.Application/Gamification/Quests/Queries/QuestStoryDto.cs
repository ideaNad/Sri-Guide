using SriGuide.Domain.Enums;

namespace SriGuide.Application.Gamification.Quests.Queries;

public class QuestStoryDto
{
    public Guid Id { get; set; }
    public string QuestName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LocationName { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public string PhotoProofUrl { get; set; } = string.Empty;
    public int EarnedXP { get; set; }
    public DateTime CompletedAt { get; set; }
}
