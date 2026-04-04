using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class RestaurantReview : BaseEntity
{
    public Guid RestaurantProfileId { get; set; }
    public RestaurantProfile? RestaurantProfile { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public List<string>? Photos { get; set; } = new();
}
