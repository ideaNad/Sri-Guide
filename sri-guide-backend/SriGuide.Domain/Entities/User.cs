using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfileImageUrl { get; set; }
    public UserRole Role { get; set; }
    public bool IsVerified { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? ResetTokenExpires { get; set; }
    public string? Slug { get; set; }
    
    // Onboarding Data
    public bool OnboardingCompleted { get; set; }
    public string? Interests { get; set; } // Comma separated or JSON
    public string? Budget { get; set; }
    public string? TravelDuration { get; set; }
    public string? PreferredLocation { get; set; }

    public GuideProfile? GuideProfile { get; set; }
    public AgencyProfile? AgencyProfile { get; set; }
    public EventOrganizerProfile? EventOrganizerProfile { get; set; }
}
