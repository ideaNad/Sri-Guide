using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;
using System.Linq;

namespace SriGuide.Application.Trips.Queries;

public record GetAgencyToursQuery(Guid UserId) : IRequest<List<AgencyTripDto>>;

public class GetAgencyToursQueryHandler : IRequestHandler<GetAgencyToursQuery, List<AgencyTripDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyToursQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AgencyTripDto>> Handle(GetAgencyToursQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyTripDto>();

        var tours = await _context.Tours
            .Include(t => t.Images)
            .Where(t => t.AgencyId == agency.Id)
            .ToListAsync(cancellationToken);

        return tours.Select(t => new AgencyTripDto
        {
            Id = t.Id,
            Title = t.Title,
            Location = t.Location,
            Price = t.Price,
            Status = t.IsActive ? "Active" : "Hidden",
            Reviews = 0, // Placeholder or fetch from Reviews table
            Rating = 5.0, // Placeholder
            Date = null,
            RawDate = null,
            Description = t.Description,
            ImageUrl = t.MainImageUrl ?? t.Images.FirstOrDefault()?.ImageUrl,
            Images = t.Images.Select(i => i.ImageUrl).ToList(),
            GuideName = agency.CompanyName, // Agency name for tours
            IsActive = t.IsActive,
            IsAgencyTour = true
        }).ToList();
    }
}
