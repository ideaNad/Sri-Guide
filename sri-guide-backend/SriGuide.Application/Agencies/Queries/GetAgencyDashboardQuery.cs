using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Agencies.Queries;

public record GetAgencyDashboardQuery(Guid UserId) : IRequest<AgencyDashboardDto>;

public class GetAgencyDashboardQueryHandler : IRequestHandler<GetAgencyDashboardQuery, AgencyDashboardDto>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AgencyDashboardDto> Handle(GetAgencyDashboardQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .ThenInclude(g => g.Trips)
                    .ThenInclude(t => t.Bookings)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new AgencyDashboardDto();

        var guides = agency.Guides;
        var trips = guides.SelectMany(g => g.Trips).ToList();
        var bookings = trips.SelectMany(t => t.Bookings).ToList();

        var dto = new AgencyDashboardDto
        {
            TotalGuides = guides.Count,
            TotalTours = trips.Count,
            TotalBookings = bookings.Count,
            TotalRevenue = bookings.Where(b => b.Status == BookingStatus.Confirmed).Sum(b => b.TotalAmount),
            RecentActivities = bookings
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new AgencyRecentActivityDto
                {
                    Title = $"New Booking: {b.Trip?.Title ?? "Tour"}",
                    Description = $"Booking for {b.BookingDate:MMM dd, yyyy}",
                    Date = b.CreatedAt,
                    Type = "Booking"
                }).ToList()
        };

        return dto;
    }
}
