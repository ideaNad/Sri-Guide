using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }
    public EventCategory Category { get; set; } = null!;

    public Guid OrganizerProfileId { get; set; }
    public EventOrganizerProfile OrganizerProfile { get; set; } = null!;

    public string EventType { get; set; } = "One-time"; // One-time, Recurring, Multi-day
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? StartTime { get; set; }
    public string? EndTime { get; set; }

    public string LocationName { get; set; } = string.Empty;
    public string? District { get; set; }
    public string? MapLocation { get; set; }

    public decimal Price { get; set; }
    public string Currency { get; set; } = "LKR";
    public int MaxParticipants { get; set; }

    public string? CoverImage { get; set; }
    public string? GalleryImages { get; set; } // Comma separated or JSON

    public bool IsPublished { get; set; }
    public bool IsCancelled { get; set; }

    public ICollection<EventFieldValue> FieldValues { get; set; } = new List<EventFieldValue>();
}
