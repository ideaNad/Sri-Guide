using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Trips.Queries;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Discovery.Queries;

public record GetPopularToursQuery(Guid? CurrentUserId = null) : IRequest<List<RecentTripDto>>;

public class GetPopularToursQueryHandler : IRequestHandler<GetPopularToursQuery, List<RecentTripDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPopularToursQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RecentTripDto>> Handle(GetPopularToursQuery request, CancellationToken cancellationToken)
    {
        var popularTours = await _context.Tours
            .Include(t => t.Agency)
            .Include(t => t.Images)
            .Where(t => t.IsActive)
            .OrderByDescending(t => _context.TourLikes.Count(tl => tl.TourId == t.Id))
            .Take(4)
            .ToListAsync(cancellationToken);

        var userLikedTourIds = request.CurrentUserId.HasValue 
            ? await _context.TourLikes
                .Where(tl => tl.UserId == request.CurrentUserId.Value)
                .Select(tl => tl.TourId)
                .ToListAsync(cancellationToken)
            : new List<Guid>();

        return popularTours.Select(t => {
            var targetId = t.Id;
            var targetType = "Tour";
            var reviews = _context.Reviews.Where(r => r.TargetId == targetId && r.TargetType == targetType).ToList();
            var rating = reviews.Any() ? Math.Round(reviews.Average(r => (double)r.Rating), 1) : 0;

            return new RecentTripDto(
                t.Id,
                t.Title,
                t.Slug,
                t.Description,
                t.Location,
                null, // Date
                t.MainImageUrl != null && !t.MainImageUrl.StartsWith("/") && !t.MainImageUrl.StartsWith("http")
                    ? "/" + t.MainImageUrl
                    : t.MainImageUrl,
                t.Agency?.CompanyName ?? "Sri Lankan Agency",
                t.Agency?.User?.ProfileImageUrl, // Simplified
                t.AgencyId,
                _context.TourLikes.Count(tl => tl.TourId == t.Id),
                userLikedTourIds.Contains(t.Id),
                t.Price,
                t.Duration,
                t.MapLink,
                t.Category,
                true, // IsAgencyTour
                rating,
                reviews.Count
            );
        }).ToList();
    }
}
