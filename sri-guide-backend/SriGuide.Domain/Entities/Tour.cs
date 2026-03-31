using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Tour : BaseEntity, ISluggable
{
    public Guid AgencyId { get; set; }
    public AgencyProfile? Agency { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Duration { get; set; }
    public string? ParticipantCount { get; set; }
    public string? MapLink { get; set; }
    public decimal Price { get; set; }
    public string? MainImageUrl { get; set; }
    public bool IsActive { get; set; } = true;

    public List<TourImage> Images { get; set; } = new();
    public List<TourItineraryStep> Itinerary { get; set; } = new();
    public List<TourDay> DayDescriptions { get; set; } = new();
    public List<Booking> Bookings { get; set; } = new();
    public List<TourLike> Likes { get; set; } = new();
}
