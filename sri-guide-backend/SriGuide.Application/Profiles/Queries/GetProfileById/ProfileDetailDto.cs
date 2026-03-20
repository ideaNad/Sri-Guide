using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Queries.GetProfileById;

public record ProfileDetailDto(
    Guid UserId,
    string FullName,
    string Email,
    string? ProfileImageUrl,
    UserRole Role,
    string? Bio,
    List<string>? Languages,
    List<string>? Specialties,
    List<string>? OperatingAreas,
    decimal? DailyRate,
    string? CompanyName,
    string? RegistrationNumber,
    bool IsVerified,
    double Rating,
    int ReviewCount
);
