using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;

namespace SriGuide.Application.Agencies.Queries;

public record GetAgencyGuidesQuery(Guid UserId) : IRequest<List<AgencyGuideDto>>;

public class GetAgencyGuidesQueryHandler : IRequestHandler<GetAgencyGuidesQuery, List<AgencyGuideDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyGuidesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AgencyGuideDto>> Handle(GetAgencyGuidesQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.Guides)
                .ThenInclude(g => g.Trips)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyGuideDto>();

        return agency.Guides.Select(g => new AgencyGuideDto
        {
            Id = g.Id,
            Name = g.User?.FullName ?? "Unknown",
            Role = g.Specialties?.FirstOrDefault() ?? "Guide",
            Rating = 5.0, // Placeholder for rating logic
            Location = g.OperatingAreas?.FirstOrDefault() ?? "Sri Lanka",
            Status = "Available", // Placeholder for availability logic
            TripCount = g.Trips.Count
        }).ToList();
    }
}
