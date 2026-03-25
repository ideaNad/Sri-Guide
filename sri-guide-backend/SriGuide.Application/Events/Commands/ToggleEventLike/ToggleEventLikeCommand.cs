using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Events.Commands.ToggleEventLike;

public record ToggleEventLikeCommand(Guid EventId, Guid UserId) : IRequest<bool>;

public class ToggleEventLikeCommandHandler : IRequestHandler<ToggleEventLikeCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleEventLikeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleEventLikeCommand request, CancellationToken cancellationToken)
    {
        var existingLike = await _context.EventLikes
            .FirstOrDefaultAsync(l => l.EventId == request.EventId && l.UserId == request.UserId, cancellationToken);

        if (existingLike != null)
        {
            _context.EventLikes.Remove(existingLike);
            await _context.SaveChangesAsync(cancellationToken);
            return false; // Unliked
        }

        var like = new EventLike
        {
            EventId = request.EventId,
            UserId = request.UserId
        };

        _context.EventLikes.Add(like);
        await _context.SaveChangesAsync(cancellationToken);
        return true; // Liked
    }
}
