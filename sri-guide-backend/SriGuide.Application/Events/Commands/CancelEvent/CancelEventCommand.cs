using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Events.Commands.CancelEvent;

public record CancelEventCommand(Guid Id, Guid UserId) : IRequest<Unit>;

public class CancelEventCommandHandler : IRequestHandler<CancelEventCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public CancelEventCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(CancelEventCommand request, CancellationToken cancellationToken)
    {
        var @event = await _context.Events
            .Include(e => e.OrganizerProfile)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (@event == null)
        {
            throw new Exception("Event not found.");
        }

        if (@event.OrganizerProfile.UserId != request.UserId)
        {
            throw new Exception("You are not authorized to cancel this event.");
        }

        @event.IsCancelled = !@event.IsCancelled; // Toggle cancellation
        @event.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
