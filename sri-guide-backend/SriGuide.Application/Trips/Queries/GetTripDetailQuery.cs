using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Trips.Queries;
 
public record ItineraryStepDto(
    string Time,
    string Title,
    string Description,
    string? ImageUrl,
    int DayNumber,
    int Order
);

public record TripDayDto(
    int DayNumber,
    string Description,
    string? ImageUrl = null
);

public record TripDetailDto(
    Guid Id,
    string Title,
    string Description,
    string Location,
    DateTime? Date,
    List<string> Images,
    Guid? GuideId,
    string GuideName,
    string? GuideImageUrl,
    double GuideRating,
    int GuideTotalReviews,
    int LikeCount,
    bool IsLikedByCurrentUser,
    List<OtherTripDto> OtherTrips,
    bool IsActive = true,
    int ViewCount = 0
);

public record OtherTripDto(
    Guid Id,
    string Title,
    string? ImageUrl,
    string Location
);

public record GetTripDetailQuery(Guid TripId, Guid? CurrentUserId) : IRequest<TripDetailDto>;

public class GetTripDetailQueryHandler : IRequestHandler<GetTripDetailQuery, TripDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetTripDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TripDetailDto> Handle(GetTripDetailQuery request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips
            .Include(t => t.Guide)
            .Include(t => t.Agency)
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == request.TripId, cancellationToken);

        if (trip == null) throw new Exception("Trip not found");

        // Increment view count
        trip.ViewCount++;
        await _context.SaveChangesAsync(cancellationToken);

        double guideRating = 0;
        int guideTotalReviews = 0;

        if (trip.GuideId.HasValue)
        {
            var guideReviews = await _context.Reviews
                .Where(r => r.TargetType == "Trip" && _context.Trips.Where(t => t.GuideId == trip.GuideId).Select(t => t.Id).Contains(r.TargetId))
                .ToListAsync(cancellationToken);

            guideRating = guideReviews.Any() ? Math.Round(guideReviews.Average(r => (double)r.Rating), 1) : 0;
            guideTotalReviews = guideReviews.Count;
        }

        var likeCount = await _context.TripLikes.CountAsync(tl => tl.TripId == trip.Id, cancellationToken);
        var isLiked = request.CurrentUserId.HasValue && await _context.TripLikes.AnyAsync(tl => tl.TripId == trip.Id && tl.UserId == request.CurrentUserId, cancellationToken);

        return new TripDetailDto(
            trip.Id,
            trip.Title,
            trip.Description,
            trip.Location,
            trip.Date,
            trip.Images.Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.StartsWith("http") ? "/" + i.ImageUrl : i.ImageUrl).Where(url => url != null).Cast<string>().ToList(),
            trip.GuideId,
            trip.Guide?.FullName ?? (trip.Agency?.CompanyName ?? "Unknown"),
            trip.Guide != null && trip.Guide.ProfileImageUrl != null && !trip.Guide.ProfileImageUrl.StartsWith("/") && !trip.Guide.ProfileImageUrl.StartsWith("http") 
                ? "/" + trip.Guide.ProfileImageUrl 
                : (trip.Guide != null ? trip.Guide.ProfileImageUrl : (trip.Agency != null ? "https://ui-avatars.com/api/?name=" + trip.Agency.CompanyName : null)),
            guideRating,
            guideTotalReviews,
            likeCount,
            isLiked,
            await _context.Trips
                .Include(t => t.Images)
                .Where(t => (trip.GuideId != null && t.GuideId == trip.GuideId) || (trip.AgencyId != null && t.AgencyId == trip.AgencyId))
                .Where(t => t.Id != trip.Id)
                .OrderByDescending(t => t.CreatedAt)
                .Take(3)
                .Select(t => new OtherTripDto(
                    t.Id,
                    t.Title,
                    t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.StartsWith("http") ? "/" + i.ImageUrl : i.ImageUrl).FirstOrDefault(),
                    t.Location
                ))
                .ToListAsync(cancellationToken),
            trip.IsActive,
            trip.ViewCount
        );
    }
}
