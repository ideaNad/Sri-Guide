using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Transport.Queries;

public record PagedTransportResultDto(
    List<VehicleDiscoveryDto> Vehicles,
    int TotalCount,
    int Page,
    int PageSize
);

public record VehicleDiscoveryDto(
    Guid Id,
    string VehicleType,
    string Brand,
    string Model,
    int Year,
    int PassengerCapacity,
    int LuggageCapacity,
    bool HasAc,
    string? VehicleImageUrl,
    bool IsAvailable,
    bool DriverIncluded,
    double AverageRating,
    int ReviewCount,
    int LikeCount,
    bool IsLiked,
    
    // Provider Info
    Guid ProviderId,
    string BusinessName,
    string? Phone,
    string? ProfileImageUrl,
    string? District,
    string? Province,
    double? Latitude,
    double? Longitude,
    double Distance
);
