using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.DTOs;
using System.Collections.Generic;
using System.Linq;

namespace SriGuide.Application.Events.Queries.GetOrganizerDashboard;

public record GetOrganizerDashboardQuery(Guid UserId) : IRequest<OrganizerDashboardDto>;

public class GetOrganizerDashboardQueryHandler : IRequestHandler<GetOrganizerDashboardQuery, OrganizerDashboardDto>
{
    private readonly IApplicationDbContext _context;

    public GetOrganizerDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OrganizerDashboardDto> Handle(GetOrganizerDashboardQuery request, CancellationToken cancellationToken)
    {
        var organizer = await _context.EventOrganizerProfiles
            .FirstOrDefaultAsync(o => o.UserId == request.UserId, cancellationToken);
            
        if (organizer == null) throw new Exception("Organizer profile not found");

        var organizerEvents = await _context.Events
            .Include(e => e.Category)
            .Where(e => e.OrganizerProfileId == organizer.Id)
            .ToListAsync(cancellationToken);

        var eventIds = organizerEvents.Select(e => e.Id).ToList();

        // Calculate aggregate statistics
        var totalLikes = await _context.EventLikes
            .CountAsync(l => eventIds.Contains(l.EventId), cancellationToken);

        var allReviews = await _context.EventReviews
            .Where(r => eventIds.Contains(r.EventId))
            .ToListAsync(cancellationToken);

        var avgRating = allReviews.Any() ? allReviews.Average(r => (double)r.Rating) : 0.0;

        // Prioritize upcoming events, then recently created
        var now = DateTime.UtcNow;
        var recentEvents = organizerEvents
            .OrderByDescending(e => e.StartDate >= now)
            .ThenBy(e => e.StartDate)
            .ThenByDescending(e => e.CreatedAt)
            .Take(5)
            .Select(e => {
                var eReviews = allReviews.Where(r => r.EventId == e.Id).ToList();
                return new EventDetailsDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    ShortDescription = e.ShortDescription,
                    CategoryName = e.Category.Name,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Price = (double)e.Price,
                    LocationName = e.LocationName,
                    CoverImage = e.CoverImage,
                    IsPublished = e.IsPublished,
                    IsCancelled = e.IsCancelled,
                    LikeCount = _context.EventLikes.Count(l => l.EventId == e.Id), // Small query inside select is okay for top 5
                    AverageRating = eReviews.Any() ? eReviews.Average(r => (double)r.Rating) : 0.0,
                    ReviewCount = eReviews.Count
                };
            }).ToList();

        return new OrganizerDashboardDto
        {
            TotalEvents = organizerEvents.Count,
            TotalParticipants = totalLikes,
            AverageRating = avgRating,
            RecentEvents = recentEvents
        };
    }
}
