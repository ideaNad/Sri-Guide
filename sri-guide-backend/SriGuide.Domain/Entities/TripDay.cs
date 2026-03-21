using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TripDay : BaseEntity
{
    public Guid TripId { get; set; }
    public Trip? Trip { get; set; }

    public int DayNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}
