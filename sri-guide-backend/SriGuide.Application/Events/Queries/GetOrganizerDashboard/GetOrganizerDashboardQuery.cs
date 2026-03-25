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

        var events = await _context.Events
            .Include(e => e.Category)
            .Where(e => e.OrganizerProfileId == organizer.Id)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync(cancellationToken);

        return new OrganizerDashboardDto
        {
            TotalEvents = events.Count,
            TotalParticipants = 0, // Placeholder
            AverageRating = 0.0, // Placeholder
            RecentEvents = events.Take(5).Select(e => new EventDetailsDto
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
                IsCancelled = e.IsCancelled
            }).ToList()
        };
    }
}
