using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.DTOs;

namespace SriGuide.Application.Events.Queries.GetOrganizerReviews;

public record GetOrganizerReviewsQuery(Guid UserId) : IRequest<List<EventReviewDto>>;

public class GetOrganizerReviewsQueryHandler : IRequestHandler<GetOrganizerReviewsQuery, List<EventReviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetOrganizerReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventReviewDto>> Handle(GetOrganizerReviewsQuery request, CancellationToken cancellationToken)
    {
        var organizer = await _context.EventOrganizerProfiles
            .FirstOrDefaultAsync(o => o.UserId == request.UserId, cancellationToken);
            
        if (organizer == null) return new List<EventReviewDto>();

        return await _context.EventReviews
            .Include(r => r.User)
            .Include(r => r.Event)
            .Where(r => r.Event!.OrganizerProfileId == organizer.Id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new EventReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserFullName = r.User!.FullName,
                UserProfileImageUrl = r.User.ProfileImageUrl,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                EventTitle = r.Event!.Title
            })
            .ToListAsync(cancellationToken);
    }
}
