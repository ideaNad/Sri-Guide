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
        var popularTours = await _context.Trips
            .Include(t => t.Guide)
            .Include(t => t.Agency)
            .Include(t => t.Images)
            .Where(t => t.IsAgencyTour && t.IsActive && t.GuideId == null)
            .OrderByDescending(t => _context.TripLikes.Count(tl => tl.TripId == t.Id))
            .Take(4)
            .ToListAsync(cancellationToken);

        var combinedTours = popularTours;

        var userLikedTripIds = request.CurrentUserId.HasValue 
            ? await _context.TripLikes
                .Where(tl => tl.UserId == request.CurrentUserId.Value)
                .Select(tl => tl.TripId)
                .ToListAsync(cancellationToken)
            : new List<Guid>();

        return combinedTours.Select(t => new RecentTripDto(
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
            t.Guide != null ? t.Guide.FullName : (t.Agency != null ? t.Agency.CompanyName : "Sri Lankan Agency"),
            t.Guide != null && t.Guide.ProfileImageUrl != null 
                ? (!t.Guide.ProfileImageUrl.StartsWith("/") && !t.Guide.ProfileImageUrl.StartsWith("http") ? "/" + t.Guide.ProfileImageUrl : t.Guide.ProfileImageUrl)
                : (t.Agency != null ? "https://ui-avatars.com/api/?name=" + t.Agency.CompanyName : null),
            t.GuideId ?? t.AgencyId,
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
