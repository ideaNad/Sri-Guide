using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.DTOs;

public record GuideDashboardDto(
    string FullName,
    string? ProfileImageUrl,
    int TotalBookings,
    double AverageRating,
    int TotalReviews,
    int ProfileCompleteness,
    bool IsLegit,
    string VerificationStatus,
    List<DashboardActivityDto> RecentActivities,
    List<DashboardTripDto> RecentTrips,
    string? AgencyName = null,
    RecruitmentStatus? AgencyRecruitmentStatus = null,
    string? AgencyVerificationStatus = null,
    bool HasPendingAgencyUpgrade = false
);

public record DashboardActivityDto(
    string Type, // Booking, Review
    string Message,
    string TimeAgo,
    string? TargetName
);

public record DashboardTripDto(
    Guid Id,
    string Title,
    string? PrimaryImageUrl,
    DateTime? Date,
    string? Description,
    string? Location,
    List<string> Images,
    string Type = "adventure"
);
