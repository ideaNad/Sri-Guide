using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TripLike : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid TripId { get; set; }
    public Trip? Trip { get; set; }
}
