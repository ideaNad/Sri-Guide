using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Places.DTOs;

namespace SriGuide.Application.Places.Queries;

public record GetPopularPlacesQuery() : IRequest<List<PopularPlaceDto>>;

public class GetPopularPlacesQueryHandler : IRequestHandler<GetPopularPlacesQuery, List<PopularPlaceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPopularPlacesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PopularPlaceDto>> Handle(GetPopularPlacesQuery request, CancellationToken cancellationToken)
    {
        return await _context.PopularPlaces
            .OrderByDescending(p => p.ViewCount)
            .ThenByDescending(p => p.CreatedAt)
            .Select(p => new PopularPlaceDto(
                p.Id,
                p.Title,
                p.Slug,
                p.Description,
                p.ImageUrl,
                p.MapLink,
                p.ViewCount,
                p.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
