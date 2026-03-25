namespace SriGuide.Application.Events.DTOs;

public class EventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    
    public Guid OrganizerProfileId { get; set; }
    public string OrganizationName { get; set; } = string.Empty;

    public string EventType { get; set; } = string.Empty;
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
    public List<string> GalleryImages { get; set; } = new();

    public bool IsPublished { get; set; }
    public bool IsCancelled { get; set; }

    public int LikeCount { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsLiked { get; set; }

    public List<EventFieldValueDto> FieldValues { get; set; } = new();
}

public class EventDetailsDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public double Price { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public bool IsPublished { get; set; }
    public bool IsCancelled { get; set; }
    
    public int LikeCount { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}

public class EventFieldValueDto
{
    public Guid FieldId { get; set; }
    public string FieldLabel { get; set; } = string.Empty;
    public string FieldName { get; set; } = string.Empty;
    public string FieldType { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
