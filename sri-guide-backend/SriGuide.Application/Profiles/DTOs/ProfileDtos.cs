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
    Guid? AgencyId,
    string? AgencyName
);

public record AgencyProfileDto(
    string? CompanyName,
    string? CompanyEmail,
    string? RegistrationNumber,
    string? Phone,
    string? WhatsApp,
    VerificationStatus VerificationStatus
);
