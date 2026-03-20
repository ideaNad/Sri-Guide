namespace SriGuide.Application.Profiles.DTOs;

public record TouristDashboardDto(
    string FullName,
    string? ProfileImageUrl,
    int SavedToursCount,
    int UpcomingTripsCount,
    List<DashboardActivityDto> RecentActivities
);
