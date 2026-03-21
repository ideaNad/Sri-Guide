using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Trips.Commands;

public class DeleteTourCommandHandler : IRequestHandler<DeleteTourCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteTourCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteTourCommand request, CancellationToken cancellationToken)
    {
        // Resolve agency profile id from user id
        var agency = await _context.AgencyProfiles
            .Include(a => a.Guides)
            .FirstOrDefaultAsync(a => a.Id == request.UserId, cancellationToken);
            
        if (agency == null) return false;

        var guideUserIds = agency.Guides.Select(g => (Guid?)g.UserId).ToList();

        // Ensure the trip belongs to this agency OR one of its accepted guides
        var trip = await _context.Trips
            .FirstOrDefaultAsync(t => t.Id == request.TripId && 
                                     (t.AgencyId == agency.Id || (t.GuideId.HasValue && guideUserIds.Contains(t.GuideId.Value))), 
                                     cancellationToken);

        if (trip == null) return false;

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
