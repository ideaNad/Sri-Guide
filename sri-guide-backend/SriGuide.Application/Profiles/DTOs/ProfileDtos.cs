using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.DTOs;

public record UserProfileDto(
    Guid Id,
    string FullName,
    string Email,
    UserRole Role,
    bool IsVerified,
    string? ProfileImageUrl,
    DateTime CreatedAt,
    bool OnboardingCompleted,
    string? Interests,
    string? Budget,
    string? TravelDuration,
    string? PreferredLocation,
    GuideProfileDto? GuideProfile,
    AgencyProfileDto? AgencyProfile,
    EventOrganizerProfileDto? EventOrganizerProfile
);

public record EventOrganizerProfileDto(
    string? OrganizationName,
    string? Bio,
    string? Website,
    string? FacebookLink,
    string? InstagramLink,
    string? TwitterLink,
    string? TikTokLink,
    string? YouTubeLink,
    string? LinkedinLink,
    List<string>? Languages,
    List<string>? Specialties,
    List<string>? OperatingAreas,
    bool IsVerified
);

public record GuideProfileDto(
    string? Bio,
    List<string>? Languages,
    decimal? DailyRate,
    decimal? HourlyRate,
    VerificationStatus VerificationStatus,
    bool ContactForPrice,
    Guid? AgencyId,
    string? AgencyName,
    List<string>? Specialties,
    List<string>? OperatingAreas,
    string? PhoneNumber,
    string? WhatsAppNumber,
    string? YouTubeLink,
    string? TikTokLink,
    string? FacebookLink,
    string? InstagramLink,
    string? TwitterLink,
    string? LinkedinLink,
    string? RegistrationNumber = null,
    string? LicenseExpirationDate = null
);

public record AgencyProfileDto(
    Guid Id,
    string? CompanyName,
    string? Bio,
    string? CompanyEmail,
    string? RegistrationNumber,
    string? Phone,
    string? WhatsApp,
    string? CompanyAddress,
    List<string>? Specialties,
    List<string>? Languages,
    List<string>? OperatingRegions,
    string? YouTubeLink,
    string? TikTokLink,
    string? FacebookLink,
    string? InstagramLink,
    string? TwitterLink,
    string? LinkedinLink,
    bool IsVerified,
    VerificationStatus VerificationStatus,
    string? ProfileImageUrl = null
);
