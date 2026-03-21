using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Trips.Commands;

public record ToggleTourLikeCommand(Guid TourId, Guid UserId) : IRequest<bool>;

public class ToggleTourLikeCommandHandler : IRequestHandler<ToggleTourLikeCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleTourLikeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleTourLikeCommand request, CancellationToken cancellationToken)
    {
        var existing = await _context.TourLikes
            .FirstOrDefaultAsync(tl => tl.TourId == request.TourId && tl.UserId == request.UserId, cancellationToken);

        if (existing != null)
        {
            _context.TourLikes.Remove(existing);
            await _context.SaveChangesAsync(cancellationToken);
            return false; // unliked
        }

        _context.TourLikes.Add(new TourLike
        {
            UserId = request.UserId,
            TourId = request.TourId
        });

        await _context.SaveChangesAsync(cancellationToken);
        return true; // liked
    }
}
