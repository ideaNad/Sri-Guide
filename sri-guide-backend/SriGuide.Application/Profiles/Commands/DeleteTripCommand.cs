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

        // Manually delete reviews (since they don't have a direct FK)
        var reviews = await _context.Reviews
            .Where(r => r.TargetId == trip.Id && (r.TargetType == "Trip" || r.TargetType == "Adventure"))
            .ToListAsync(cancellationToken);

        if (reviews.Any())
        {
            _context.Reviews.RemoveRange(reviews);
        }

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
