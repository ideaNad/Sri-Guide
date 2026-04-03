using SriGuide.Domain.Enums;

namespace SriGuide.Application.Gamification.Quests.Queries;

public class QuestDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LocationName { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double ProximityRadiusInMeters { get; set; }
    
    public QuestCategory Category { get; set; }
    public QuestDifficulty Difficulty { get; set; }
    public string? EstimatedTime { get; set; }
    
    public int RewardXP { get; set; }
    public string? RewardBadgeName { get; set; }
    public string? RewardBadgeIconUrl { get; set; }
    public string? RewardTitle { get; set; }
    
    public string PhotoRequirement { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public bool IsCompletedByUser { get; set; }
}
