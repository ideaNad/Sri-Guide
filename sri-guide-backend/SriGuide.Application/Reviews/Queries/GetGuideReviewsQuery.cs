using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Reviews.Queries;

public record GuideReviewDto(
    Guid Id,
    string ReviewerName,
    int Rating,
    string? Comment,
    DateTime CreatedAt,
    string TargetType,
    string? TripTitle
);

public record GetGuideReviewsQuery(Guid GuideUserId) : IRequest<List<GuideReviewDto>>;

public class GetGuideReviewsQueryHandler : IRequestHandler<GetGuideReviewsQuery, List<GuideReviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGuideReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GuideReviewDto>> Handle(GetGuideReviewsQuery request, CancellationToken cancellationToken)
    {
        var guideProfile = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == request.GuideUserId, cancellationToken);

        if (guideProfile == null) return new List<GuideReviewDto>();

        // Fetch guide profile reviews
        var guideReviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetId == request.GuideUserId && r.TargetType == "Guide")
            .ToListAsync(cancellationToken);

        // Fetch trips made by this guide
        var tripIds = await _context.Trips
            .Where(t => t.GuideId == request.GuideUserId)
            .Select(t => new { t.Id, t.Title })
            .ToListAsync(cancellationToken);

        var tripIdsList = tripIds.Select(t => t.Id).ToList();

        // Fetch reviews for those trips
        var tripReviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => tripIdsList.Contains(r.TargetId) && r.TargetType == "Trip")
            .ToListAsync(cancellationToken);

        var allReviews = new List<GuideReviewDto>();

        foreach (var r in guideReviews)
        {
            allReviews.Add(new GuideReviewDto(
                r.Id,
                r.User?.FullName ?? "Tourist",
                r.Rating,
                r.Comment,
                r.CreatedAt,
                "Guide",
                null
            ));
        }

        foreach (var r in tripReviews)
        {
            var title = tripIds.FirstOrDefault(t => t.Id == r.TargetId)?.Title;
            allReviews.Add(new GuideReviewDto(
                r.Id,
                r.User?.FullName ?? "Tourist",
                r.Rating,
                r.Comment,
                r.CreatedAt,
                "Trip",
                title
            ));
        }

        return allReviews.OrderByDescending(r => r.CreatedAt).ToList();
    }
}
