using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Profiles.Commands;

public record DeleteTripCommand(Guid Id, Guid? GuideId, Guid? AgencyId = null) : IRequest<bool>;

public class DeleteTripCommandHandler : IRequestHandler<DeleteTripCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteTripCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteTripCommand request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips
            .FirstOrDefaultAsync(t => t.Id == request.Id && 
                (request.GuideId != null ? t.GuideId == request.GuideId : t.AgencyId == request.AgencyId), 
                cancellationToken);

        if (trip == null) return false;

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
