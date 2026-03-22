using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;

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

    public UpdatePopularPlaceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdatePopularPlaceCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PopularPlaces
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity == null)
            return false;

        entity.Title = request.Title;
        entity.Slug = SlugHelper.GenerateSlug(request.Title);
        entity.Description = request.Description;
        entity.MapLink = request.MapLink;
        
        if (!string.IsNullOrEmpty(request.ImageUrl))
            entity.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
