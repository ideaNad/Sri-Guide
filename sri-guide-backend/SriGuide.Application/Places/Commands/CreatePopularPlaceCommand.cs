using MediatR;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Places.Commands;

public record CreatePopularPlaceCommand(
    string Title,
    string Description,
    string ImageUrl,
    string? MapLink
) : IRequest<Guid>;

public class CreatePopularPlaceCommandHandler : IRequestHandler<CreatePopularPlaceCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public CreatePopularPlaceCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<Guid> Handle(CreatePopularPlaceCommand request, CancellationToken cancellationToken)
    {
        var entity = new PopularPlace
        {
            Title = request.Title,
            Slug = await _slugService.CreateUniqueSlugAsync<PopularPlace>(request.Title, cancellationToken: cancellationToken),
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            MapLink = request.MapLink,
            ViewCount = 0
        };

        _context.PopularPlaces.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
