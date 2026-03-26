using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Reviews.Queries;

public record TransportReviewDto(
    Guid Id,
    string ReviewerName,
    string? ReviewerImageUrl,
    int Rating,
    string? Comment,
    DateTime CreatedAt,
    string TargetType,
    string? VehicleName
);

public record GetTransportReviewsQuery(Guid ProviderUserId) : IRequest<List<TransportReviewDto>>;

public class GetTransportReviewsQueryHandler : IRequestHandler<GetTransportReviewsQuery, List<TransportReviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetTransportReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransportReviewDto>> Handle(GetTransportReviewsQuery request, CancellationToken cancellationToken)
    {
        var transportProfile = await _context.TransportProfiles
            .FirstOrDefaultAsync(t => t.UserId == request.ProviderUserId, cancellationToken);

        if (transportProfile == null) return new List<TransportReviewDto>();

        // Fetch profile reviews
        var profileReviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetId == transportProfile.Id && r.TargetType == "Transport")
            .ToListAsync(cancellationToken);

        // Fetch vehicle reviews
        var vehicles = await _context.Vehicles
            .Where(v => v.TransportProfileId == transportProfile.Id)
            .Select(v => new { v.Id, Name = $"{v.Brand} {v.Model}" })
            .ToListAsync(cancellationToken);

        var vehicleIds = vehicles.Select(v => v.Id).ToList();

        var vehicleReviews = await _context.VehicleReviews
            .Include(r => r.User)
            .Where(r => vehicleIds.Contains(r.VehicleId))
            .ToListAsync(cancellationToken);

        var allReviews = new List<TransportReviewDto>();

        foreach (var r in profileReviews)
        {
            allReviews.Add(new TransportReviewDto(
                r.Id,
                r.User?.FullName ?? "Tourist",
                r.User?.ProfileImageUrl != null && !r.User.ProfileImageUrl.StartsWith("/") && !r.User.ProfileImageUrl.StartsWith("http") 
                    ? "/" + r.User.ProfileImageUrl 
                    : r.User?.ProfileImageUrl,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                "Transport",
                null
            ));
        }

        foreach (var r in vehicleReviews)
        {
            var vehicle = vehicles.FirstOrDefault(v => v.Id == r.VehicleId);
            allReviews.Add(new TransportReviewDto(
                r.Id,
                r.User?.FullName ?? "Tourist",
                r.User?.ProfileImageUrl != null && !r.User.ProfileImageUrl.StartsWith("/") && !r.User.ProfileImageUrl.StartsWith("http") 
                    ? "/" + r.User.ProfileImageUrl 
                    : r.User?.ProfileImageUrl,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                "Vehicle",
                vehicle?.Name
            ));
        }

        return allReviews.OrderByDescending(r => r.CreatedAt).ToList();
    }
}
