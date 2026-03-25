using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.DTOs;

namespace SriGuide.Application.Events.Queries.GetLikedEvents;

public record GetLikedEventsQuery(Guid UserId) : IRequest<List<EventDto>>;

public class GetLikedEventsQueryHandler : IRequestHandler<GetLikedEventsQuery, List<EventDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLikedEventsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventDto>> Handle(GetLikedEventsQuery request, CancellationToken cancellationToken)
    {
        var likedEventIds = await _context.EventLikes
            .Where(l => l.UserId == request.UserId)
            .Select(l => l.EventId)
            .ToListAsync(cancellationToken);

        return await _context.Events
            .Include(e => e.Category)
            .Include(e => e.OrganizerProfile)
            .Where(e => likedEventIds.Contains(e.Id) && e.IsPublished && !e.IsCancelled)
            .OrderByDescending(e => e.StartDate)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                ShortDescription = e.ShortDescription,
                CategoryId = e.CategoryId,
                CategoryName = e.Category.Name,
                OrganizerProfileId = e.OrganizerProfileId,
                OrganizationName = e.OrganizerProfile.OrganizationName,
                EventType = e.EventType,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                LocationName = e.LocationName,
                District = e.District,
                Price = e.Price,
                Currency = e.Currency,
                CoverImage = e.CoverImage,
                LikeCount = _context.EventLikes.Count(l => l.EventId == e.Id),
                ReviewCount = _context.EventReviews.Count(r => r.EventId == e.Id),
                AverageRating = _context.EventReviews.Where(r => r.EventId == e.Id).Any() 
                    ? _context.EventReviews.Where(r => r.EventId == e.Id).Average(r => (double)r.Rating) 
                    : 0,
                IsLiked = _context.EventLikes.Any(l => l.EventId == e.Id && l.UserId == request.UserId)
            })
            .ToListAsync(cancellationToken);
    }
}
