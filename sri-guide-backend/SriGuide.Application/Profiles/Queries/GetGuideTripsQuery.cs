using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Profiles.Queries;

public record GetGuideTripsQuery(Guid GuideId) : IRequest<List<DashboardTripDto>>;

public class GetGuideTripsQueryHandler : IRequestHandler<GetGuideTripsQuery, List<DashboardTripDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGuideTripsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DashboardTripDto>> Handle(GetGuideTripsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Trips
            .Where(t => t.GuideId == request.GuideId)
            .OrderByDescending(t => t.Date ?? t.CreatedAt)
            .Select(t => new DashboardTripDto(
                t.Id,
                t.Title,
                t.Images.Select(i => i.ImageUrl).FirstOrDefault(),
                t.Date,
                t.Description,
                t.Location,
                t.Images.Select(i => i.ImageUrl).ToList()
            ))
            .ToListAsync(cancellationToken);
    }
}
