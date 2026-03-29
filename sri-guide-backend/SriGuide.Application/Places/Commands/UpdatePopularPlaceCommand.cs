using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Places.Commands;

public record UpdatePopularPlaceCommand(
    Guid Id,
    string Title,
    string Description,
    string? ImageUrl,
    string? MapLink
) : IRequest<bool>;

public class UpdatePopularPlaceCommandHandler : IRequestHandler<UpdatePopularPlaceCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdatePopularPlaceCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<bool> Handle(UpdatePopularPlaceCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PopularPlaces
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity == null)
            return false;

        entity.Title = request.Title;
        entity.Slug = await _slugService.CreateUniqueSlugAsync<PopularPlace>(request.Title, entity.Id, cancellationToken);
        entity.Description = request.Description;
        entity.MapLink = request.MapLink;
        
        if (!string.IsNullOrEmpty(request.ImageUrl))
            entity.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
