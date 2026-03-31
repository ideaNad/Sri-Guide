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
    EventOrganizerProfileDto? EventOrganizerProfile,
    TransportProfileDto? TransportProfile
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

public record TransportProfileDto(
    Guid Id,
    string BusinessName,
    string? Description,
    string? Phone,
    string? ProfileImageUrl,
    string? WhatsAppNumber,
    string? District,
    string? Province,
    double? Latitude,
    double? Longitude,
    bool IsAvailable,
    List<VehicleDto>? Vehicles
);

public record VehicleDto(
    Guid Id,
    string VehicleType,
    string Brand,
    string Model,
    int Year,
    int PassengerCapacity,
    int LuggageCapacity,
    bool HasAc,
    string? VehicleImageUrl,
    bool IsAvailable = true,
    bool DriverIncluded = false,
    double AverageRating = 0,
    int ReviewCount = 0,
    int LikeCount = 0,
    bool HasLiked = false,
    List<VehicleReviewDto>? Reviews = null
);

public record VehicleReviewDto(
    Guid Id,
    string ReviewerName,
    string? ReviewerImageUrl,
    int Rating,
    string? Comment,
    DateTime CreatedAt
);
