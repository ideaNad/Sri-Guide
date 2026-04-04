using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class User : BaseEntity, ISluggable
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

    // Gamification Data
    public int XP { get; set; } = 0;
    public int Level { get; set; } = 1;
    public string? CurrentTitle { get; set; }
    
    public ICollection<QuestSubmission> QuestSubmissions { get; set; } = new List<QuestSubmission>();
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();

    public GuideProfile? GuideProfile { get; set; }
    public AgencyProfile? AgencyProfile { get; set; }
    public EventOrganizerProfile? EventOrganizerProfile { get; set; }
    public TransportProfile? TransportProfile { get; set; }
    public RestaurantProfile? RestaurantProfile { get; set; }
}
