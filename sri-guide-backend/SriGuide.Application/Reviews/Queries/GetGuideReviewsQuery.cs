using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Reviews.Queries;

public record GuideReviewDto(
    Guid Id,
    string ReviewerName,
    string? ReviewerImageUrl,
    int Rating,
    string? Comment,
    DateTime CreatedAt,
    string TargetType,
    string? TripTitle
);

public record GetGuideReviewsQuery(Guid GuideUserId, string? Type = null) : IRequest<List<GuideReviewDto>>;

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
            
        var agencyProfile = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.GuideUserId, cancellationToken);

        if (guideProfile == null && agencyProfile == null) return new List<GuideReviewDto>();

        // Determine if we want Agency or Guide reviews
        bool isAgency;
        if (request.Type?.ToLower() == "agency")
        {
            isAgency = true;
        }
        else if (request.Type?.ToLower() == "guide")
        {
            isAgency = false;
        }
        else
        {
            isAgency = agencyProfile != null;
        }

        // Fetch profile reviews (Guide or Agency)
        var targetType = isAgency ? "Agency" : "Guide";
        var profileReviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetId == request.GuideUserId && r.TargetType == targetType)
            .ToListAsync(cancellationToken);

        // Fetch trips/tours made by this guide or agency
        var tripReviews = new List<Review>();
        var tripInfo = new List<dynamic>();

        if (isAgency)
        {
            // For agency, we fetch both Tours and Trips
            var tours = await _context.Tours
                .Where(t => t.AgencyId == agencyProfile.Id)
                .Select(t => new { t.Id, t.Title, Type = "Tour" })
                .ToListAsync(cancellationToken);
                
            var trips = await _context.Trips
                .Where(t => t.AgencyId == agencyProfile.Id)
                .Select(t => new { t.Id, t.Title, Type = "Trip" })
                .ToListAsync(cancellationToken);
                
            var allItems = tours.Concat(trips).ToList();
            var itemIds = allItems.Select(i => i.Id).ToList();
            tripInfo = allItems.Cast<dynamic>().ToList();

            tripReviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => itemIds.Contains(r.TargetId) && (r.TargetType == "Tour" || r.TargetType == "Trip"))
                .ToListAsync(cancellationToken);
        }
        else
        {
            var trips = await _context.Trips
                .Where(t => t.GuideId == request.GuideUserId)
                .Select(t => new { t.Id, t.Title, Type = "Trip" })
                .ToListAsync(cancellationToken);
                
            var itemIds = trips.Select(t => t.Id).ToList();
            tripInfo = trips.Cast<dynamic>().ToList();

            tripReviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => itemIds.Contains(r.TargetId) && r.TargetType == "Trip")
                .ToListAsync(cancellationToken);
        }

        var allReviews = new List<GuideReviewDto>();

        foreach (var r in profileReviews)
        {
            allReviews.Add(new GuideReviewDto(
                r.Id,
                r.User?.FullName ?? "Tourist",
                r.User?.ProfileImageUrl != null && !r.User.ProfileImageUrl.StartsWith("/") && !r.User.ProfileImageUrl.StartsWith("http") 
                    ? "/" + r.User.ProfileImageUrl 
                    : r.User?.ProfileImageUrl,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                targetType,
                null
            ));
        }

        foreach (var r in tripReviews)
        {
            var item = tripInfo.FirstOrDefault(t => t.Id == r.TargetId);
            allReviews.Add(new GuideReviewDto(
                r.Id,
                r.User?.FullName ?? "Tourist",
                r.User?.ProfileImageUrl != null && !r.User.ProfileImageUrl.StartsWith("/") && !r.User.ProfileImageUrl.StartsWith("http") 
                    ? "/" + r.User.ProfileImageUrl 
                    : r.User?.ProfileImageUrl,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                r.TargetType,
                item?.Title
            ));
        }

        return allReviews.OrderByDescending(r => r.CreatedAt).ToList();
    }
}
