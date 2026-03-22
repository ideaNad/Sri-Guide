namespace SriGuide.Application.Profiles.DTOs;

public record PublicProfileDto(
    Guid Id,
    string FullName,
    string? Slug,
    string? ProfileImageUrl,
    string? Bio,
    List<string> Specialties,
    List<string> OperatingAreas,
    List<string> Languages,
    decimal DailyRate,
    decimal HourlyRate,
    bool ContactForPrice,
    bool IsLegit,
    string VerificationStatus,
    double AverageRating,
    int TotalReviews,

    // Social Links
    string? PhoneNumber,
    string? WhatsAppNumber,
    string? YouTubeLink,
    string? TikTokLink,
    string? FacebookLink,
    string? InstagramLink,
    string? LinkedinLink,
    string? TwitterLink,

    List<PublicTripDto> AgencyTours,
    List<PublicTripDto> RecentTrips,
    List<SriGuide.Application.Agencies.DTOs.AgencyGuideDto>? Guides = null,
    string Role = "Guide"
);

public record PublicTripDto(
    Guid Id,
    string Title,
    string? Slug,
    string PrimaryImageUrl,
    DateTime? Date,
    string Description,
    string Location,
    double Rating,
    int ReviewCount,
    List<string> Images,
    bool IsLiked = false
);
