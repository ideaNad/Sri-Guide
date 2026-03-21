using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Trip : BaseEntity
{
    public Guid? GuideId { get; set; }
    public User? Guide { get; set; }

    public Guid? AgencyId { get; set; }
    public AgencyProfile? Agency { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime? Date { get; set; }
    
    public string? MainImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public int ViewCount { get; set; }

    public List<TripImage> Images { get; set; } = new();
    public List<TripLike> Likes { get; set; } = new();
}
