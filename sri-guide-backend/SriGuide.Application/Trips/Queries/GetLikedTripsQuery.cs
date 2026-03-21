using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Trips.Queries;

public record GetLikedTripsQuery(Guid UserId) : IRequest<List<DashboardTripDto>>;

public class GetLikedTripsQueryHandler : IRequestHandler<GetLikedTripsQuery, List<DashboardTripDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLikedTripsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DashboardTripDto>> Handle(GetLikedTripsQuery request, CancellationToken cancellationToken)
    {
        var likedTrips = await _context.TripLikes
            .Include(l => l.Trip)
                .ThenInclude(t => t!.Images)
            .Where(l => l.UserId == request.UserId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => l.Trip)
            .Where(t => t != null && t.IsActive)
            .ToListAsync(cancellationToken);

        return likedTrips.Select(t => new DashboardTripDto(
            t!.Id,
            t.Title,
            t.Images.FirstOrDefault()?.ImageUrl,
            t.Date,
            t.Description,
            t.Location,
            t.Images.Select(i => i.ImageUrl).ToList()
        )).ToList();
    }
}
