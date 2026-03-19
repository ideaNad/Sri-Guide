using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Admin.DTOs;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Queries;

public record GetAdminStatsQuery() : IRequest<AdminStatsDto>;

public class GetAdminStatsQueryHandler : IRequestHandler<GetAdminStatsQuery, AdminStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetAdminStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminStatsDto> Handle(GetAdminStatsQuery request, CancellationToken cancellationToken)
    {
        // 1. Basic Counts
        var totalGuides = await _context.GuideProfiles.CountAsync(cancellationToken);
        var pendingVerifications = await _context.GuideProfiles.CountAsync(g => g.VerificationStatus == Domain.Enums.VerificationStatus.Pending, cancellationToken);
        
        var totalTourists = await _context.Users.CountAsync(u => u.Role == UserRole.Tourist, cancellationToken);
        
        var totalAgencies = await _context.AgencyProfiles.CountAsync(cancellationToken);
        var pendingUpgrades = await _context.AgencyProfiles.CountAsync(a => a.VerificationStatus == Domain.Enums.VerificationStatus.Pending, cancellationToken);
        
        var totalTrips = await _context.Trips.CountAsync(cancellationToken);
        var totalLikes = await _context.TripLikes.CountAsync(cancellationToken);
        var totalBookings = await _context.Bookings.CountAsync(cancellationToken);

        // 2. Trends (Last 7 Days)
        var last7Days = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .OrderBy(d => d)
            .ToList();

        var bookingsRaw = await _context.Bookings
            .Where(b => b.CreatedAt >= last7Days.First())
            .ToListAsync(cancellationToken);

        var registrationsRaw = await _context.Users
            .Where(u => u.CreatedAt >= last7Days.First())
            .ToListAsync(cancellationToken);

        var bookingTrends = last7Days.Select(date => new TrendDto(
            date.ToString("ddd"),
            bookingsRaw.Count(b => b.CreatedAt.Date == date)
        )).ToList();

        var registrationTrends = last7Days.Select(date => new TrendDto(
            date.ToString("ddd"),
            registrationsRaw.Count(u => u.CreatedAt.Date == date)
        )).ToList();

        // 3. System Stats (Simulated for now)
        var random = new Random();
        var apiResponse = 45.0 + (random.NextDouble() * 10.0);
        var memoryUsage = 38.0 + (random.NextDouble() * 5.0);
        var uptime = 99.9;

        return new AdminStatsDto(
            totalGuides,
            pendingVerifications,
            totalTourists,
            totalAgencies,
            pendingUpgrades,
            totalTrips,
            totalLikes,
            totalBookings,
            bookingTrends,
            registrationTrends,
            apiResponse,
            memoryUsage,
            uptime
        );
    }
}
