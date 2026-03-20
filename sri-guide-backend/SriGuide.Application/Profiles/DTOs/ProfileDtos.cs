using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.DTOs;

public record UserProfileDto(
    Guid Id,
    string FullName,
    string Email,
    UserRole Role,
    bool IsVerified,
    string? ProfileImageUrl,
    GuideProfileDto? GuideProfile,
    AgencyProfileDto? AgencyProfile
);

public record GuideProfileDto(
    string? Bio,
    List<string> Languages,
    decimal? DailyRate,
    decimal? HourlyRate,
    VerificationStatus VerificationStatus,
    bool ContactForPrice,
    Guid? AgencyId,
    string? AgencyName,
    List<string> Specialties,
    List<string> OperatingAreas,
    string? PhoneNumber,
    string? WhatsAppNumber,
    string? YouTubeLink,
    string? TikTokLink,
    string? FacebookLink,
    string? InstagramLink,
    string? TwitterLink,
    string? LinkedinLink
);

public record AgencyProfileDto(
    string? CompanyName,
    string? CompanyEmail,
    string? RegistrationNumber,
    string? Phone,
    string? WhatsApp,
    VerificationStatus VerificationStatus
);
