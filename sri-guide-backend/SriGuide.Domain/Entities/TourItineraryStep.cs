using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TourItineraryStep : BaseEntity
{
    public Guid TourId { get; set; }
    public Tour? Tour { get; set; }

    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int DayNumber { get; set; } = 1;
    public int Order { get; set; }
}
