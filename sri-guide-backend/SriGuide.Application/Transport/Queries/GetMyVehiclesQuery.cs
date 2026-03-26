using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Transport.Queries;

public record GetMyVehiclesQuery(Guid UserId) : IRequest<List<VehicleDto>>;

public class GetMyVehiclesQueryHandler : IRequestHandler<GetMyVehiclesQuery, List<VehicleDto>>
{
    private readonly IApplicationDbContext _context;

    public GetMyVehiclesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VehicleDto>> Handle(GetMyVehiclesQuery request, CancellationToken cancellationToken)
    {
        var vehicles = await _context.Vehicles
            .Include(v => v.TransportProfile)
            .Include(v => v.Reviews)
            .Include(v => v.Likes)
            .Where(v => v.TransportProfile!.UserId == request.UserId)
            .Select(v => new VehicleDto(
                v.Id,
                v.VehicleType,
                v.Brand,
                v.Model,
                v.Year,
                v.PassengerCapacity,
                v.LuggageCapacity,
                v.HasAc,
                v.VehicleImageUrl,
                v.IsAvailable,
                v.DriverIncluded,
                v.Reviews.Any() ? v.Reviews.Average(r => r.Rating) : 0,
                v.Reviews.Count,
                v.Likes.Count,
                false, // Owner doesn't "like" their own vehicle in this context usually
                v.Reviews.OrderByDescending(r => r.CreatedAt).Take(10).Select(r => new VehicleReviewDto(
                    r.Id,
                    "Guest", // TODO: Include User in Reviews
                    null,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                )).ToList()
            ))
            .ToListAsync(cancellationToken);

        return vehicles;
    }
}
