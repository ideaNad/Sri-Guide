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

        // Optimized: Using projections to avoid overhead and implement quality-based ordering
        var vehiclesQuery = query
            .Select(v => new
            {
                Vehicle = v,
                TransportProfile = v.TransportProfile,
                ReviewCount = v.Reviews.Count,
                LikeCount = v.Likes.Count,
                AvgRating = v.Reviews.Any() ? v.Reviews.Average(r => (double)r.Rating) : 0
            });

        var allMatchingData = await vehiclesQuery.ToListAsync(cancellationToken);

        // Calculate distance and filter by radius
        var vehiclesWithDistance = allMatchingData
            .Select(x => new
            {
                Data = x,
                Distance = x.TransportProfile!.Latitude.HasValue && x.TransportProfile.Longitude.HasValue
                    ? CalculateDistance(request.Lat, request.Lng, x.TransportProfile.Latitude!.Value, x.TransportProfile.Longitude!.Value)
                    : 0
            })
            .Where(x => x.Distance <= request.RadiusInKm || !x.Data.TransportProfile!.Latitude.HasValue)
            // Quality-based ordering: Rating, then Review Count, then Distance
            .OrderByDescending(x => x.Data.AvgRating)
            .ThenByDescending(x => x.Data.ReviewCount)
            .ThenBy(x => x.Distance)
            .ToList();

        var totalCount = vehiclesWithDistance.Count;

        // Apply pagination
        var pagedVehicles = vehiclesWithDistance
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new VehicleDiscoveryDto(
                x.Data.Vehicle.Id,
                x.Data.Vehicle.VehicleType,
                x.Data.Vehicle.Brand,
                x.Data.Vehicle.Model,
                x.Data.Vehicle.Year,
                x.Data.Vehicle.PassengerCapacity,
                x.Data.Vehicle.LuggageCapacity,
                x.Data.Vehicle.HasAc,
                x.Data.Vehicle.VehicleImageUrl,
                x.Data.Vehicle.IsAvailable,
                x.Data.Vehicle.DriverIncluded,
                x.Data.AvgRating,
                x.Data.ReviewCount,
                x.Data.LikeCount,
                request.UserId.HasValue && x.Data.Vehicle.Likes.Any(l => l.UserId == request.UserId.Value),
                
                // Provider Info
                x.Data.TransportProfile!.Id,
                x.Data.TransportProfile.BusinessName,
                x.Data.TransportProfile.Phone,
                x.Data.TransportProfile.ProfileImageUrl,
                x.Data.TransportProfile.District,
                x.Data.TransportProfile.Province,
                x.Data.TransportProfile.Latitude,
                x.Data.TransportProfile.Longitude,
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
