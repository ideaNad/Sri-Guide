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
            .Select(l => new { 
                Trip = l.Trip, 
                CreatedAt = l.CreatedAt 
            })
            .Where(x => x.Trip != null && x.Trip.IsActive)
            .ToListAsync(cancellationToken);

        var likedTours = await _context.TourLikes
            .Include(l => l.Tour)
                .ThenInclude(t => t!.Images)
            .Where(l => l.UserId == request.UserId)
            .Select(l => new { 
                Tour = l.Tour, 
                CreatedAt = l.CreatedAt 
            })
            .Where(x => x.Tour != null && x.Tour.IsActive)
            .ToListAsync(cancellationToken);

        var tripResult = likedTrips.Select(x => new {
            Dto = new DashboardTripDto(
                x.Trip!.Id,
                x.Trip.Title,
                x.Trip.Images.FirstOrDefault()?.ImageUrl,
                x.Trip.Date,
                x.Trip.Description,
                x.Trip.Location,
                x.Trip.Images.Select(i => i.ImageUrl).ToList(),
                "adventure"
            ),
            CreatedAt = x.CreatedAt
        });

        var tourResult = likedTours.Select(x => new {
            Dto = new DashboardTripDto(
                x.Tour!.Id,
                x.Tour.Title,
                x.Tour.Images.FirstOrDefault()?.ImageUrl,
                null,
                x.Tour.Description,
                x.Tour.Location,
                x.Tour.Images.Select(i => i.ImageUrl).ToList(),
                "tour"
            ),
            CreatedAt = x.CreatedAt
        });

        return tripResult.Concat(tourResult)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.Dto)
            .ToList();
    }
}
