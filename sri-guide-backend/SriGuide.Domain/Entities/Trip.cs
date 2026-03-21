using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Trip : BaseEntity
{
    public Guid? GuideId { get; set; }
    public User? Guide { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime? Date { get; set; }
    
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? Duration { get; set; }
    public string? MapLink { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsAgencyTour { get; set; }
    
    public Guid? AgencyId { get; set; }
    public AgencyProfile? Agency { get; set; }

    public List<TripImage> Images { get; set; } = new();
    public List<Booking> Bookings { get; set; } = new();
    public List<ItineraryStep> Itinerary { get; set; } = new();
}
