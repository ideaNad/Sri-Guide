using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class AgencyProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? CompanyEmail { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }

    // Social Links
    public string? YouTubeLink { get; set; }
    public string? TikTokLink { get; set; }
    public string? FacebookLink { get; set; }
    public string? InstagramLink { get; set; }
    public string? TwitterLink { get; set; }
    public string? LinkedinLink { get; set; }
    
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
    public bool IsVerified { get; set; }

    public ICollection<GuideProfile> Guides { get; set; } = new List<GuideProfile>();
}
