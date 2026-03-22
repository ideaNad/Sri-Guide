using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Places.DTOs;

namespace SriGuide.Application.Places.Queries;

public record GetPopularPlaceByIdQuery(string IdOrSlug) : IRequest<PopularPlaceDto>;

public class GetPopularPlaceByIdQueryHandler : IRequestHandler<GetPopularPlaceByIdQuery, PopularPlaceDto?>
{
    private readonly IApplicationDbContext _context;

    public GetPopularPlaceByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PopularPlaceDto?> Handle(GetPopularPlaceByIdQuery request, CancellationToken cancellationToken)
    {
        var isGuid = Guid.TryParse(request.IdOrSlug, out var placeId);
        
        var entity = await _context.PopularPlaces
            .FirstOrDefaultAsync(p => isGuid ? p.Id == placeId : p.Slug == request.IdOrSlug, cancellationToken);

        if (entity == null)
            return null;

        // Increment view count
        entity.ViewCount++;
        await _context.SaveChangesAsync(cancellationToken);

        return new PopularPlaceDto(
            entity.Id,
            entity.Title,
            entity.Slug,
            entity.Description,
            entity.ImageUrl,
            entity.MapLink,
            entity.ViewCount,
            entity.CreatedAt
        );
    }
}
