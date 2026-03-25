using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class EventReview : BaseEntity
{
    public Guid EventId { get; set; }
    public Event? Event { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
}
