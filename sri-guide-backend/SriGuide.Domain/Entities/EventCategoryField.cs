using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class EventCategoryField : BaseEntity
{
    public Guid CategoryId { get; set; }
    public EventCategory Category { get; set; } = null!;

    public string FieldLabel { get; set; } = string.Empty;
    public string FieldName { get; set; } = string.Empty;
    public string FieldType { get; set; } = "text"; // text, number, select, checkbox
    
    public string? OptionsJson { get; set; } // For select/checkbox options
    public bool IsRequired { get; set; }
    public int SortOrder { get; set; }
}
