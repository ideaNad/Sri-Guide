using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TripImage : BaseEntity
{
    public Guid TripId { get; set; }
    public Trip? Trip { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string? Caption { get; set; }
}
