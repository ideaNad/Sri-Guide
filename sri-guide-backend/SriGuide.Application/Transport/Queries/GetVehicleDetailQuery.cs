using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Transport.Queries;

public record GetVehicleDetailQuery(Guid VehicleId, Guid? CurrentUserId = null) : IRequest<VehicleDetailDto>;

public record VehicleDetailDto(
    VehicleDto Vehicle,
    TransportProfileDto Provider,
    List<VehicleDto> OtherVehicles
);

public class GetVehicleDetailQueryHandler : IRequestHandler<GetVehicleDetailQuery, VehicleDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetVehicleDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VehicleDetailDto> Handle(GetVehicleDetailQuery request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.TransportProfile)
            .Include(v => v.Reviews)
            .Include(v => v.Likes)
            .FirstOrDefaultAsync(v => v.Id == request.VehicleId, cancellationToken);

        if (vehicle == null) throw new Exception("Vehicle not found");

        var transportProfile = await _context.TransportProfiles
            .Include(p => p.Vehicles)
                .ThenInclude(v => v.Reviews)
            .Include(p => p.Vehicles)
                .ThenInclude(v => v.Likes)
            .FirstOrDefaultAsync(p => p.Id == vehicle.TransportProfileId, cancellationToken);

        if (transportProfile == null) throw new Exception("Provider not found");

        var otherVehicles = transportProfile.Vehicles
            .Where(v => v.Id != vehicle.Id)
            .Select(v => MapToVehicleDto(v, request.CurrentUserId))
            .ToList();

        return new VehicleDetailDto(
            MapToVehicleDto(vehicle, request.CurrentUserId),
            new TransportProfileDto(
                transportProfile.Id,
                transportProfile.BusinessName,
                transportProfile.Description,
                transportProfile.Phone,
                transportProfile.ProfileImageUrl,
                transportProfile.WhatsAppNumber,
                transportProfile.District,
                transportProfile.Province,
                transportProfile.Latitude,
                transportProfile.Longitude,
                transportProfile.IsAvailable,
                null // Don't nest vehicles again inside the provider object to avoid cycles
            ),
            otherVehicles
        );
    }

    private VehicleDto MapToVehicleDto(SriGuide.Domain.Entities.Vehicle v, Guid? currentUserId)
    {
        return new VehicleDto(
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
            currentUserId.HasValue && v.Likes.Any(l => l.UserId == currentUserId.Value),
            v.Reviews.OrderByDescending(r => r.CreatedAt).Select(r => new VehicleReviewDto(
                r.Id,
                "Traveler", // TODO: Include User in Reviews
                null,
                r.Rating,
                r.Comment,
                r.CreatedAt
            )).ToList()
        );
    }
}
