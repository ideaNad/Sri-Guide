using SriGuide.Application.Events.DTOs;
using System.Collections.Generic;

namespace SriGuide.Application.Events.Queries.GetOrganizerDashboard;

public class OrganizerDashboardDto
{
    public int TotalEvents { get; set; }
    public int TotalParticipants { get; set; }
    public double AverageRating { get; set; }
    public List<EventDetailsDto> RecentEvents { get; set; } = new();
}
