using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class EventFieldValue : BaseEntity
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    public Guid FieldId { get; set; }
    public EventCategoryField Field { get; set; } = null!;

    public string Value { get; set; } = string.Empty;
}
