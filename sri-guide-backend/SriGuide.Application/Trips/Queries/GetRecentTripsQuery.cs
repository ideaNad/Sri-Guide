using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Trips.Queries;

public record RecentTripDto(
    Guid Id,
    string Title,
    string Description,
    string Location,
    DateTime? Date,
    string? ImageUrl,
    string GuideName,
    string? GuideImageUrl,
    Guid? GuideUserId,
    int LikeCount,
    bool IsLiked = false,
    decimal? Price = null,
    string? Duration = null,
    string? MapLink = null,
    string? Category = null,
    bool IsAgencyTour = false
);

public record GetRecentTripsQuery(Guid? CurrentUserId = null) : IRequest<List<RecentTripDto>>;

public class GetRecentTripsQueryHandler : IRequestHandler<GetRecentTripsQuery, List<RecentTripDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRecentTripsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RecentTripDto>> Handle(GetRecentTripsQuery request, CancellationToken cancellationToken)
    {
        var recentTrips = await _context.Trips
            .Include(t => t.Guide)
            .Include(t => t.Images)
            .Where(t => t.IsActive && (!t.IsAgencyTour || t.GuideId != null))
            .OrderByDescending(t => t.CreatedAt)
            .Take(6)
            .ToListAsync(cancellationToken);

        var userLikedTripIds = request.CurrentUserId.HasValue 
            ? await _context.TripLikes
                .Where(tl => tl.UserId == request.CurrentUserId.Value)
                .Select(tl => tl.TripId)
                .ToListAsync(cancellationToken)
            : new List<Guid>();

        return recentTrips.Select(t => new RecentTripDto(
            t.Id,
            t.Title,
            t.Description,
            t.Location,
            t.Date,
            t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault() != null && 
            !t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault()!.StartsWith("/") && 
            !t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault()!.StartsWith("http")
                ? "/" + t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault()
                : t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault(),
            t.Guide != null ? t.Guide.FullName : "Unknown Guide",
            t.Guide != null && t.Guide.ProfileImageUrl != null && !t.Guide.ProfileImageUrl.StartsWith("/") && !t.Guide.ProfileImageUrl.StartsWith("http")
                ? "/" + t.Guide.ProfileImageUrl
                : (t.Guide != null ? t.Guide.ProfileImageUrl : null),
            t.GuideId,
            _context.TripLikes.Count(tl => tl.TripId == t.Id),
            userLikedTripIds.Contains(t.Id),
            t.Price,
            t.Duration,
            t.MapLink,
            t.Category,
            t.IsAgencyTour
        )).ToList();
    }
}
