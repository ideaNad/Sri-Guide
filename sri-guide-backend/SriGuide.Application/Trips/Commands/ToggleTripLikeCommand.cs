using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Trips.Commands;

public record ToggleTripLikeCommand(Guid TripId, Guid UserId) : IRequest<bool>;

public class ToggleTripLikeCommandHandler : IRequestHandler<ToggleTripLikeCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleTripLikeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleTripLikeCommand request, CancellationToken cancellationToken)
    {
        var tripExists = await _context.Trips.AnyAsync(t => t.Id == request.TripId, cancellationToken);
        if (!tripExists) return false;

        var existing = await _context.TripLikes
            .FirstOrDefaultAsync(tl => tl.TripId == request.TripId && tl.UserId == request.UserId, cancellationToken);

        if (existing != null)
        {
            _context.TripLikes.Remove(existing);
            await _context.SaveChangesAsync(cancellationToken);
            return false; // unliked
        }

        _context.TripLikes.Add(new TripLike
        {
            UserId = request.UserId,
            TripId = request.TripId
        });

        await _context.SaveChangesAsync(cancellationToken);
        return true; // liked
    }
}
