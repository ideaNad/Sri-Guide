using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class AgencyProfile : BaseEntity, ISluggable
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Bio { get; set; }
    public string? CompanyEmail { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? RegistrationDocUrl { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? CompanyAddress { get; set; }

    public List<string>? Specialties { get; set; } = new();
    public List<string>? Languages { get; set; } = new();
    public List<string>? OperatingRegions { get; set; } = new();
    
    // Social Links
    public string? YouTubeLink { get; set; }
    public string? TikTokLink { get; set; }
    public string? FacebookLink { get; set; }
    public string? InstagramLink { get; set; }
    public string? TwitterLink { get; set; }
    public string? LinkedinLink { get; set; }
    
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.None;
    public bool IsVerified { get; set; }

    public ICollection<GuideProfile> Guides { get; set; } = new List<GuideProfile>();
}
