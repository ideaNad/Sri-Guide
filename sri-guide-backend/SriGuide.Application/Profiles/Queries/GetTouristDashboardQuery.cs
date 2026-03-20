using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Queries;

public record GetTouristDashboardQuery(Guid UserId) : IRequest<TouristDashboardDto>;

public class GetTouristDashboardQueryHandler : IRequestHandler<GetTouristDashboardQuery, TouristDashboardDto>
{
    private readonly IApplicationDbContext _context;

    public GetTouristDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TouristDashboardDto> Handle(GetTouristDashboardQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null) throw new Exception("User not found");

        var savedToursCount = await _context.TripLikes
            .CountAsync(l => l.UserId == request.UserId, cancellationToken);

        var upcomingTripsCount = await _context.Bookings
            .CountAsync(b => b.CustomerId == request.UserId && b.BookingDate >= DateTime.UtcNow, cancellationToken);

        // Recent Activities (Liked trips, Bookings, Reviews)
        var activities = new List<DashboardActivityDto>();

        var recentLikes = await _context.TripLikes
            .Include(l => l.Trip)
            .Where(l => l.UserId == request.UserId)
            .OrderByDescending(l => l.CreatedAt)
            .Take(3)
            .ToListAsync(cancellationToken);

        foreach (var like in recentLikes)
        {
            activities.Add(new DashboardActivityDto(
                "Like",
                $"You liked {like.Trip?.Title ?? "a trip"}",
                GetTimeAgo(like.CreatedAt),
                like.Trip?.Title
            ));
        }

        var recentBookings = await _context.Bookings
            .Include(b => b.Guide)
            .Where(b => b.CustomerId == request.UserId)
            .OrderByDescending(b => b.CreatedAt)
            .Take(3)
            .ToListAsync(cancellationToken);

        foreach (var booking in recentBookings)
        {
            activities.Add(new DashboardActivityDto(
                "Booking",
                $"Booking for {booking.BookingDate:MMM dd, yyyy}",
                GetTimeAgo(booking.CreatedAt),
                booking.Guide?.FullName
            ));
        }

        return new TouristDashboardDto(
            user.FullName,
            user.ProfileImageUrl,
            savedToursCount,
            upcomingTripsCount,
            activities.OrderByDescending(a => a.TimeAgo).ToList()
        );
    }

    private string GetTimeAgo(DateTime dateTime)
    {
        var span = DateTime.UtcNow - dateTime;
        if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes}m ago";
        if (span.TotalHours < 24) return $"{(int)span.TotalHours}h ago";
        return $"{(int)span.TotalDays}d ago";
    }
}
