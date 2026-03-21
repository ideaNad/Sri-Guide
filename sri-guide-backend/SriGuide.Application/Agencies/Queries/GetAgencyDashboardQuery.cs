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
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new AgencyDashboardDto();

        var guideIds = agency.Guides.Select(g => g.UserId).ToList();
        
        var tours = await _context.Tours
            .Include(t => t.Bookings)
            .Include(t => t.Images)
            .Where(t => t.AgencyId == agency.Id)
            .ToListAsync(cancellationToken);

        var pastTrips = await _context.Trips
            .Where(t => t.AgencyId == agency.Id || (t.GuideId != null && guideIds.Contains(t.GuideId.Value)))
            .ToListAsync(cancellationToken);

        var bookings = tours.SelectMany(t => t.Bookings).ToList();

        var dto = new AgencyDashboardDto
        {
            TotalGuides = agency.Guides.Count,
            TotalActiveTours = tours.Count(t => t.IsActive),
            TotalHiddenTours = tours.Count(t => !t.IsActive),
            TotalBookings = bookings.Count,
            TotalRevenue = bookings.Where(b => b.Status == BookingStatus.Confirmed).Sum(b => b.TotalAmount),
            RecentActivities = bookings
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new AgencyRecentActivityDto
                {
                    Title = $"New Booking: {b.Tour?.Title ?? "Tour"}",
                    Description = $"Booking for {b.BookingDate:MMM dd, yyyy}",
                    Date = b.CreatedAt,
                    Type = "Booking"
                }).ToList(),
            RecentTours = tours
                .OrderByDescending(t => t.CreatedAt)
                .Take(3)
                .Select(t => new AgencyRecentTourDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Price = t.Price,
                    Status = t.IsActive ? "Active" : "Hidden",
                    Date = null, // Tours don't have a single date usually
                    ImageUrl = t.MainImageUrl ?? t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault()
                }).ToList()
        };

        return dto;
    }
}
