using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class RestaurantLike : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid RestaurantProfileId { get; set; }
    public RestaurantProfile? RestaurantProfile { get; set; }
}
