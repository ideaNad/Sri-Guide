using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.DTOs;

namespace SriGuide.Application.Events.Queries.GetEventReviews;

public record GetEventReviewsQuery(Guid EventId) : IRequest<List<EventReviewDto>>;

public class GetEventReviewsQueryHandler : IRequestHandler<GetEventReviewsQuery, List<EventReviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetEventReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventReviewDto>> Handle(GetEventReviewsQuery request, CancellationToken cancellationToken)
    {
        return await _context.EventReviews
            .Include(r => r.User)
            .Where(r => r.EventId == request.EventId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new EventReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserFullName = r.User!.FullName,
                UserProfileImageUrl = r.User.ProfileImageUrl,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
