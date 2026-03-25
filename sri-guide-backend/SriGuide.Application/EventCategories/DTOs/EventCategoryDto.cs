namespace SriGuide.Application.EventCategories.DTOs;

public class EventCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public bool IsActive { get; set; }
    public List<EventCategoryFieldDto> CustomFields { get; set; } = new();
}

public class EventCategoryFieldDto
{
    public Guid Id { get; set; }
    public string FieldLabel { get; set; } = string.Empty;
    public string FieldName { get; set; } = string.Empty;
    public string FieldType { get; set; } = string.Empty;
    public string? OptionsJson { get; set; }
    public bool IsRequired { get; set; }
    public int SortOrder { get; set; }
}
