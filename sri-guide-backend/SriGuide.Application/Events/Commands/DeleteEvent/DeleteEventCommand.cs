using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Events.Commands.DeleteEvent;

public record DeleteEventCommand(Guid Id, Guid UserId) : IRequest<Unit>;

public class DeleteEventCommandHandler : IRequestHandler<DeleteEventCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteEventCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
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
            throw new Exception("You are not authorized to delete this event.");
        }

        _context.Events.Remove(@event);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
