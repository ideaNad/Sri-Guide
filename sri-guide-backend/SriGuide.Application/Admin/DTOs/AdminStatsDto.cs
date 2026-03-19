namespace SriGuide.Application.Admin.DTOs;

public record AdminStatsDto(
    int TotalGuides,
    int PendingGuideVerifications,
    int TotalTourists,
    int TotalAgencies,
    int PendingAgencyUpgrades,
    int TotalTrips,
    int TotalLikes,
    int TotalBookings,
    List<TrendDto> DailyBookings,
    List<TrendDto> DailyRegistrations,
    double ApiResponseMs,
    double MemoryUsagePercent,
    double UptimePercent
);

public record TrendDto(string Label, int Value);
