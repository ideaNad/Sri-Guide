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

    public CreatePopularPlaceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreatePopularPlaceCommand request, CancellationToken cancellationToken)
    {
        var entity = new PopularPlace
        {
            Title = request.Title,
            Slug = SlugHelper.GenerateSlug(request.Title),
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
