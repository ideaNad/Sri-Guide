using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Trips.Commands;

public record UpdateTripCommand(
    Guid TripId,
    Guid GuideId,
    string Title,
    string Location,
    string Description,
    DateTime? Date
) : IRequest<bool>;

public class UpdateTripCommandHandler : IRequestHandler<UpdateTripCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateTripCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateTripCommand request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips
            .FirstOrDefaultAsync(t => t.Id == request.TripId && t.GuideId == request.GuideId, cancellationToken);

        if (trip == null) return false;

        trip.Title = request.Title;
        trip.Location = request.Location;
        trip.Description = request.Description;
        trip.Date = request.Date;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
