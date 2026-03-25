using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class EventLike : BaseEntity
{
    public Guid EventId { get; set; }
    public Event? Event { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }
}
