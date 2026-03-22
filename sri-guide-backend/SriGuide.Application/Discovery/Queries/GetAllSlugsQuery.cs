using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Discovery.Queries;

public record AllSlugsDto(
    List<string> Guides,
    List<string> Tours,
    List<string> Trips,
    List<string> Places,
    List<string> Agencies
);

public record GetAllSlugsQuery() : IRequest<AllSlugsDto>;

public class GetAllSlugsQueryHandler : IRequestHandler<GetAllSlugsQuery, AllSlugsDto>
{
    private readonly IApplicationDbContext _context;

    public GetAllSlugsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AllSlugsDto> Handle(GetAllSlugsQuery request, CancellationToken cancellationToken)
    {
        return new AllSlugsDto(
            await _context.Users.Where(u => u.Slug != null).Select(u => u.Slug!).ToListAsync(cancellationToken),
            await _context.Tours.Where(t => t.Slug != null).Select(t => t.Slug!).ToListAsync(cancellationToken),
            await _context.Trips.Where(t => t.Slug != null).Select(t => t.Slug!).ToListAsync(cancellationToken),
            await _context.PopularPlaces.Where(p => p.Slug != null).Select(p => p.Slug!).ToListAsync(cancellationToken),
            await _context.AgencyProfiles.Where(a => a.Slug != null).Select(a => a.Slug!).ToListAsync(cancellationToken)
        );
    }
}
