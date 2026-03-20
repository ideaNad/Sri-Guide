using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;

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
            .Include(a => a.Guides)
                .ThenInclude(g => g.Trips)
                    .ThenInclude(t => t.Images)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyTripDto>();

        var trips = agency.Guides.SelectMany(g => g.Trips).ToList();

        return trips.Select(t => new AgencyTripDto
        {
            Id = t.Id,
            Title = t.Title,
            Location = t.Location,
            Price = 0, // Placeholder
            Status = "Active",
            Reviews = 0,
            Rating = 5.0,
            Date = t.Date?.ToString("MMM dd") ?? "TBD",
            ImageUrl = t.Images.FirstOrDefault()?.ImageUrl,
            GuideName = t.Guide?.FullName ?? "Unknown"
        }).ToList();
    }
}
