using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Transport.Queries;

public record NearbyTransportSearchQuery(
    double Lat, 
    double Lng, 
    double RadiusInKm, 
    string? VehicleType = null,
    int? MinCapacity = null,
    bool? DriverIncluded = null,
    bool? HasAc = null,
    int Page = 1,
    int PageSize = 10,
    Guid? UserId = null
) : IRequest<PagedTransportResultDto>;

public class NearbyTransportSearchQueryHandler : IRequestHandler<NearbyTransportSearchQuery, PagedTransportResultDto>
{
    private readonly IApplicationDbContext _context;

    public NearbyTransportSearchQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedTransportResultDto> Handle(NearbyTransportSearchQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Vehicles
            .Include(v => v.TransportProfile)
            .Include(v => v.Reviews)
            .Include(v => v.Likes)
            .Where(v => v.IsAvailable && v.TransportProfile!.IsAvailable);

        // Apply filters
        if (!string.IsNullOrEmpty(request.VehicleType))
            query = query.Where(v => v.VehicleType.ToLower() == request.VehicleType.ToLower());

        if (request.MinCapacity.HasValue)
            query = query.Where(v => v.PassengerCapacity >= request.MinCapacity.Value);

        if (request.DriverIncluded.HasValue)
            query = query.Where(v => v.DriverIncluded == request.DriverIncluded.Value);

        if (request.HasAc.HasValue)
            query = query.Where(v => v.HasAc == request.HasAc.Value);

        var allMatchingVehicles = await query.ToListAsync(cancellationToken);

        // Calculate distance and filter by radius
        var vehiclesWithDistance = allMatchingVehicles
            .Select(v => new
            {
                Vehicle = v,
                Distance = v.TransportProfile!.Latitude.HasValue && v.TransportProfile.Longitude.HasValue
                    ? CalculateDistance(request.Lat, request.Lng, v.TransportProfile.Latitude!.Value, v.TransportProfile.Longitude!.Value)
                    : 0
            })
            .Where(x => x.Distance <= request.RadiusInKm || !x.Vehicle.TransportProfile!.Latitude.HasValue)
            .OrderBy(x => x.Distance)
            .ToList();

        var totalCount = vehiclesWithDistance.Count;

        // Apply pagination
        var pagedVehicles = vehiclesWithDistance
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new VehicleDiscoveryDto(
                x.Vehicle.Id,
                x.Vehicle.VehicleType,
                x.Vehicle.Brand,
                x.Vehicle.Model,
                x.Vehicle.Year,
                x.Vehicle.PassengerCapacity,
                x.Vehicle.LuggageCapacity,
                x.Vehicle.HasAc,
                x.Vehicle.VehicleImageUrl,
                x.Vehicle.IsAvailable,
                x.Vehicle.DriverIncluded,
                x.Vehicle.Reviews.Any() ? x.Vehicle.Reviews.Average(r => r.Rating) : 0,
                x.Vehicle.Reviews.Count,
                x.Vehicle.Likes.Count,
                request.UserId.HasValue && x.Vehicle.Likes.Any(l => l.UserId == request.UserId.Value),
                
                // Provider Info
                x.Vehicle.TransportProfile!.Id,
                x.Vehicle.TransportProfile.BusinessName,
                x.Vehicle.TransportProfile.Phone,
                x.Vehicle.TransportProfile.ProfileImageUrl,
                x.Vehicle.TransportProfile.District,
                x.Vehicle.TransportProfile.Province,
                x.Vehicle.TransportProfile.Latitude,
                x.Vehicle.TransportProfile.Longitude,
                x.Distance
            ))
            .ToList();

        return new PagedTransportResultDto(pagedVehicles, totalCount, request.Page, request.PageSize);
    }

    private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var r = 6371; // Earth radius in km
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return r * c;
    }

    private double ToRadians(double deg) => deg * (Math.PI / 180);
}
