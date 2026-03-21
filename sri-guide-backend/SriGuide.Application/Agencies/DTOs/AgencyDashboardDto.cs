namespace SriGuide.Application.Agencies.DTOs;

public class AgencyDashboardDto
{
    public int TotalActiveTours { get; set; }
    public int TotalHiddenTours { get; set; }
    public int TotalGuides { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<AgencyRecentActivityDto> RecentActivities { get; set; } = new();
    public List<AgencyRecentTourDto> RecentTours { get; set; } = new();
}

public class AgencyRecentTourDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Date { get; set; }
}

public class AgencyRecentActivityDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Type { get; set; } = string.Empty; // e.g., "Booking", "Review", "Guide"
}
