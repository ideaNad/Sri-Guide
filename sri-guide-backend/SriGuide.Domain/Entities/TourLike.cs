using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TourLike : BaseEntity
{
    public Guid TourId { get; set; }
    public Tour? Tour { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }
}
