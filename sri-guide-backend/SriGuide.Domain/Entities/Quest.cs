using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class Quest : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LocationName { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double ProximityRadiusInMeters { get; set; } = 500;
    
    public QuestCategory Category { get; set; }
    public QuestDifficulty Difficulty { get; set; }
    public string? EstimatedTime { get; set; }
    
    public int RewardXP { get; set; }
    public Guid? RewardBadgeId { get; set; }
    public Badge? RewardBadge { get; set; }
    public string? RewardTitle { get; set; }
    
    public string PhotoRequirement { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string? IconUrl { get; set; }
    
    public ICollection<QuestSubmission> Submissions { get; set; } = new List<QuestSubmission>();
}
