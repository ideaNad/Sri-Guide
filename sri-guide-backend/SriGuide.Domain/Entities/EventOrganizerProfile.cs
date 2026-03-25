using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class EventOrganizerProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string OrganizationName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Website { get; set; }
    public string? FacebookLink { get; set; }
    public string? InstagramLink { get; set; }
    public string? TwitterLink { get; set; }
    public string? TikTokLink { get; set; }
    public string? YouTubeLink { get; set; }
    public string? LinkedinLink { get; set; }

    public List<string>? Languages { get; set; } = new();
    public List<string>? Specialties { get; set; } = new();
    public List<string>? OperatingAreas { get; set; } = new();
    
    public bool IsVerified { get; set; }
    public string? VerificationDetails { get; set; }

    public ICollection<Event> Events { get; set; } = new List<Event>();
}
