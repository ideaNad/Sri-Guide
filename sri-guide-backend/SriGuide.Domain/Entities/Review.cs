using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Review : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid TargetId { get; set; }
    public string TargetType { get; set; } = string.Empty; // Guide, Hotel, etc.
    
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
}
