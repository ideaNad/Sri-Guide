using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class GuideProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Bio { get; set; } = string.Empty;
    public List<string> Languages { get; set; } = new();
    public string? LicenseNumber { get; set; }
    public List<string>? Specialties { get; set; } = new();
    public List<string>? OperatingAreas { get; set; } = new();
    public decimal? DailyRate { get; set; }
    public decimal? HourlyRate { get; set; }
    public bool ContactForPrice { get; set; }
    
    // Verification details
    public string? RegistrationNumber { get; set; }
    public DateTime? LicenseExpirationDate { get; set; }
    public bool IsLegit { get; set; }

    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.None;
    public bool IsVerified { get; set; }

    // Contact & Social Links
    public string? PhoneNumber { get; set; }
    public string? WhatsAppNumber { get; set; }
    public string? YouTubeLink { get; set; }
    public string? TikTokLink { get; set; }
    public string? FacebookLink { get; set; }
    public string? InstagramLink { get; set; }
    public string? TwitterLink { get; set; }
    public string? LinkedinLink { get; set; }

    public Guid? AgencyId { get; set; }
    public AgencyProfile? Agency { get; set; }
    public RecruitmentStatus AgencyRecruitmentStatus { get; set; } = RecruitmentStatus.None;

    public List<Trip> Trips { get; set; } = new();
}
