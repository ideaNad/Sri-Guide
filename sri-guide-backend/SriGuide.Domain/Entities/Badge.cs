using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class Badge : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public QuestDifficulty Level { get; set; } // Bronze, Silver, Gold, Legendary mapped to QuestDifficulty for simplicity or separate enum
    public string Criteria { get; set; } = string.Empty;
    
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}
