using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class EventCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<EventCategoryField> CustomFields { get; set; } = new List<EventCategoryField>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
