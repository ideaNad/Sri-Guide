using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Queries;

public record GetGuideDashboardQuery(Guid UserId) : IRequest<GuideDashboardDto>;

public class GetGuideDashboardQueryHandler : IRequestHandler<GetGuideDashboardQuery, GuideDashboardDto>
{
    private readonly IApplicationDbContext _context;

    public GetGuideDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GuideDashboardDto> Handle(GetGuideDashboardQuery request, CancellationToken cancellationToken)
    {
        var guideProfile = await _context.GuideProfiles
            .Include(g => g.User)
            .Include(g => g.Agency)
            .FirstOrDefaultAsync(g => g.UserId == request.UserId, cancellationToken);

        if (guideProfile == null) throw new Exception("Guide profile not found");

        var bookings = await _context.Bookings
            .Include(b => b.Customer)
            .Where(b => b.GuideId == request.UserId)
            .ToListAsync(cancellationToken);

        var guideReviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetId == request.UserId && r.TargetType == "Guide")
            .ToListAsync(cancellationToken);

        var allTripIds = await _context.Trips
            .Where(t => t.GuideId == request.UserId)
            .Select(t => t.Id)
            .ToListAsync(cancellationToken);

        var tripReviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetType == "Trip" && allTripIds.Contains(r.TargetId))
            .ToListAsync(cancellationToken);

        var allReviews = guideReviews.Concat(tripReviews).ToList();

        var trips = await _context.Trips
            .Include(t => t.Images)
            .Where(t => t.GuideId == request.UserId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(5)
            .ToListAsync(cancellationToken);

        // Calculate statistics
        var totalBookings = bookings.Count;
        var totalReviews = allReviews.Count;
        var averageRating = totalReviews > 0 ? allReviews.Average(r => r.Rating) : 0;

        // Calculate Profile Completeness
        int completeness = 0;
        if (!string.IsNullOrEmpty(guideProfile.Bio)) completeness += 20;
        if (guideProfile.Languages?.Any() == true) completeness += 10;
        if (guideProfile.DailyRate.HasValue || guideProfile.HourlyRate.HasValue) completeness += 10;
        // Check for photos (dummy check for now as we don't have a Photos table yet, but we'll assume Bio/Images later)
        completeness += 20; // Assume photos for now or add a real check if possible
        if (guideProfile.IsVerified) completeness += 40;

        // Recent Activities
        var activities = new List<DashboardActivityDto>();
        
        foreach (var review in allReviews.OrderByDescending(r => r.CreatedAt).Take(3))
        {
            activities.Add(new DashboardActivityDto(
                "Review",
                $"New {review.Rating}-star review received",
                GetTimeAgo(review.CreatedAt),
                review.User?.FullName ?? "A Tourist"
            ));
        }

        foreach (var booking in bookings.OrderByDescending(b => b.CreatedAt).Take(3))
        {
            activities.Add(new DashboardActivityDto(
                "Booking",
                $"New booking for {booking.BookingDate:MMM dd, yyyy}",
                GetTimeAgo(booking.CreatedAt),
                booking.Customer?.FullName ?? "A Tourist"
            ));
        }

        var recentTrips = trips.Select(t => new DashboardTripDto(
            t.Id,
            t.Title,
            t.Images.FirstOrDefault()?.ImageUrl,
            t.Date,
            t.Description,
            t.Location,
            t.Images.Select(i => i.ImageUrl).ToList()
        )).ToList();

        var ownedAgency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        return new GuideDashboardDto(
            guideProfile.User!.FullName,
            guideProfile.User!.ProfileImageUrl,
            totalBookings,
            averageRating,
            totalReviews,
            completeness,
            guideProfile.IsLegit,
            guideProfile.VerificationStatus.ToString(),
            activities.OrderByDescending(a => a.TimeAgo).ToList(),
            recentTrips,
            guideProfile.Agency?.CompanyName,
            guideProfile.AgencyRecruitmentStatus,
            ownedAgency?.VerificationStatus.ToString(),
            ownedAgency != null && ownedAgency.VerificationStatus == VerificationStatus.Pending
        );
    }

    private string GetTimeAgo(DateTime dateTime)
    {
        var span = DateTime.UtcNow - dateTime;
        if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes} minutes ago";
        if (span.TotalHours < 24) return $"{(int)span.TotalHours} hours ago";
        return $"{(int)span.TotalDays} days ago";
    }
}
