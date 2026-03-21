using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class ItineraryStep : BaseEntity
{
    public Guid TripId { get; set; }
    public Trip? Trip { get; set; }

    public string Time { get; set; } = string.Empty; // e.g., "08:00 AM"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int DayNumber { get; set; } = 1;
    public int Order { get; set; }
}
