using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Transport.Queries;

public record GetTransportProfileByIdQuery(Guid Id) : IRequest<TransportProfileDto?>;

public class GetTransportProfileByIdQueryHandler : IRequestHandler<GetTransportProfileByIdQuery, TransportProfileDto?>
{
    private readonly IApplicationDbContext _context;

    public GetTransportProfileByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TransportProfileDto?> Handle(GetTransportProfileByIdQuery request, CancellationToken cancellationToken)
    {
        var profile = await _context.TransportProfiles
            .Include(p => p.Vehicles)
                .ThenInclude(v => v.Reviews)
            .Include(p => p.Vehicles)
                .ThenInclude(v => v.Likes)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (profile == null) return null;

        return new TransportProfileDto(
            profile.Id,
            profile.BusinessName,
            profile.Description,
            profile.Phone,
            profile.ProfileImageUrl,
            profile.WhatsAppNumber,
            profile.District,
            profile.Province,
            profile.Latitude,
            profile.Longitude,
            profile.IsAvailable,
            profile.Vehicles.Select(v => new VehicleDto(
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
                false, // Default hasLiked to false for public view unless otherwise handled
                v.Reviews.OrderByDescending(r => r.CreatedAt).Select(r => new VehicleReviewDto(
                    r.Id,
                    "Traveler",
                    null,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                )).ToList()
            )).ToList()
        );
    }
}
