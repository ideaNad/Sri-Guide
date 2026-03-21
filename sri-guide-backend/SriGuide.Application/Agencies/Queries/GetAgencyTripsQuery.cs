using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Domain.Enums;
using System.Linq;

namespace SriGuide.Application.Agencies.Queries;

public record GetAgencyTripsQuery(Guid UserId) : IRequest<List<AgencyTripDto>>;

public class GetAgencyTripsQueryHandler : IRequestHandler<GetAgencyTripsQuery, List<AgencyTripDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyTripsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AgencyTripDto>> Handle(GetAgencyTripsQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .ThenInclude(g => g.Trips)
                    .ThenInclude(t => t.Images)
            .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .ThenInclude(g => g.User)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyTripDto>();

        var guideUserIds = agency.Guides.Select(g => g.UserId).ToList();

        var trips = await _context.Trips
            .Include(t => t.Images)
            .Include(t => t.Guide)
            .Where(t => t.AgencyId == agency.Id || (t.GuideId.HasValue && guideUserIds.Contains(t.GuideId.Value)))
            .ToListAsync(cancellationToken);

        var tripIds = trips.Select(t => t.Id).ToList();

        // Calculate real ratings and review counts for trips
        var tripStats = await _context.Reviews
            .Where(r => tripIds.Contains(r.TargetId) && r.TargetType == "Trip")
            .GroupBy(r => r.TargetId)
            .Select(g => new { TripId = g.Key, AverageRating = Math.Round(g.Average(r => (double)r.Rating), 1), Count = g.Count() })
            .ToDictionaryAsync(x => x.TripId, x => x, cancellationToken);

        return trips.Select(t => new AgencyTripDto
        {
            Id = t.Id,
            Title = t.Title,
            Location = t.Location,
            Price = t.Price,
            Status = t.IsActive ? "Active" : "Hidden",
            Reviews = tripStats.TryGetValue(t.Id, out var stats) ? stats.Count : (int?)null,
            Rating = tripStats.TryGetValue(t.Id, out var stats2) ? stats2.AverageRating : (double?)null,
            Date = t.Date?.ToString("MMM dd"),
            ImageUrl = t.Images.FirstOrDefault()?.ImageUrl,
            GuideName = t.Guide?.FullName ?? "Unknown",
            IsActive = t.IsActive
        }).ToList();
    }
}
