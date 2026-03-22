using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Places.Commands;

public record DeletePopularPlaceCommand(Guid Id) : IRequest<bool>;

public class DeletePopularPlaceCommandHandler : IRequestHandler<DeletePopularPlaceCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeletePopularPlaceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeletePopularPlaceCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PopularPlaces
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity == null)
            return false;

        _context.PopularPlaces.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
