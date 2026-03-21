using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TourImage : BaseEntity
{
    public Guid TourId { get; set; }
    public Tour? Tour { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string? Caption { get; set; }
}
