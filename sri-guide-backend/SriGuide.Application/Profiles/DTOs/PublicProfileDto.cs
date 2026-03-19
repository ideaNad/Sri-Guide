namespace SriGuide.Application.Profiles.DTOs;

public record PublicProfileDto(
    Guid Id,
    string FullName,
    string? ProfileImageUrl,
    string Bio,
    string Specialty,
    List<string> Languages,
    decimal DailyRate,
    bool IsLegit,
    string VerificationStatus,
    List<PublicTripDto> RecentTrips
);

public record PublicTripDto(
    Guid Id,
    string Title,
    string PrimaryImageUrl,
    DateTime? Date,
    string Description,
    string Location,
    double Rating,
    int ReviewCount,
    List<string> Images
);
