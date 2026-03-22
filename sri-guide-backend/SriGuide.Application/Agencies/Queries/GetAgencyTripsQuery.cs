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
                .ThenInclude(g => g.User)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyTripDto>();

        var guideUserIds = agency.Guides.Select(g => (Guid?)g.UserId).ToList();

        var trips = await _context.Trips
            .Include(t => t.Images)
            .Include(t => t.Guide)
            .Where(t => t.AgencyId == agency.Id || guideUserIds.Contains(t.GuideId))
            .ToListAsync(cancellationToken);

        var tripIds = trips.Select(t => t.Id).ToList();

        return trips.Select(t => new AgencyTripDto
        {
            Id = t.Id,
            Title = t.Title,
            Slug = t.Slug,
            Location = t.Location,
            Price = null,
            Status = t.IsActive ? "Active" : "Hidden",
            Reviews = 0, // Simplified for gallery trips
            Rating = 0,
            Date = t.Date?.ToString("MMM dd"),
            RawDate = t.Date?.ToString("yyyy-MM-dd"),
            Description = t.Description,
            ImageUrl = t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.StartsWith("http") ? "/" + i.ImageUrl : i.ImageUrl).FirstOrDefault(),
            Images = t.Images.Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.StartsWith("http") ? "/" + i.ImageUrl : i.ImageUrl).Where(url => url != null).Cast<string>().ToList(),
            GuideName = t.Guide?.FullName ?? "Unknown",
            IsActive = t.IsActive,
            IsAgencyTour = false
        }).ToList();
    }
}
