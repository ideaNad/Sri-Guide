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

        // Ensure the tour belongs to this agency
        var tour = await _context.Tours
            .FirstOrDefaultAsync(t => t.Id == request.TripId && t.AgencyId == agency.Id, 
                                     cancellationToken);

        if (tour == null) return false;

        // Manually delete reviews (since they don't have a direct FK)
        var reviews = await _context.Reviews
            .Where(r => r.TargetId == tour.Id && r.TargetType == "Tour")
            .ToListAsync(cancellationToken);
        
        if (reviews.Any())
        {
            _context.Reviews.RemoveRange(reviews);
        }

        _context.Tours.Remove(tour);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
