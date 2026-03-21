using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TourDay : BaseEntity
{
    public Guid TourId { get; set; }
    public Tour? Tour { get; set; }

    public int DayNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}
