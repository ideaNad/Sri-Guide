using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Trip : BaseEntity
{
    public Guid GuideId { get; set; }
    public User? Guide { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime? Date { get; set; }

    public List<TripImage> Images { get; set; } = new();
    public List<Booking> Bookings { get; set; } = new();
}
