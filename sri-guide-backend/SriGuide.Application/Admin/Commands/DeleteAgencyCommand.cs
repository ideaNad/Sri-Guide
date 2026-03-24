using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Commands;

public record DeleteAgencyCommand(Guid AgencyProfileId) : IRequest<bool>;

public class DeleteAgencyCommandHandler : IRequestHandler<DeleteAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteAgencyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteAgencyCommand request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == request.AgencyProfileId, cancellationToken);

        if (agency == null) return false;

        // 1. Get all tours of this agency to delete their reviews
        var tourIds = await _context.Tours
            .Where(t => t.AgencyId == agency.Id)
            .Select(t => t.Id)
            .ToListAsync(cancellationToken);

        if (tourIds.Any())
        {
            var tourReviews = await _context.Reviews
                .Where(r => tourIds.Contains(r.TargetId) && r.TargetType == "Tour")
                .ToListAsync(cancellationToken);
            
            if (tourReviews.Any())
            {
                _context.Reviews.RemoveRange(tourReviews);
            }
        }

        // 2. Get all trips of this agency (adventure trips) to delete their reviews
        var tripIds = await _context.Trips
            .Where(t => t.AgencyId == agency.Id)
            .Select(t => t.Id)
            .ToListAsync(cancellationToken);

        if (tripIds.Any())
        {
            var tripReviews = await _context.Reviews
                .Where(r => tripIds.Contains(r.TargetId) && (r.TargetType == "Trip" || r.TargetType == "Adventure"))
                .ToListAsync(cancellationToken);

            if (tripReviews.Any())
            {
                _context.Reviews.RemoveRange(tripReviews);
            }
        }

        // 3. Delete reviews for the agency itself
        var agencyReviews = await _context.Reviews
            .Where(r => r.TargetId == agency.Id && r.TargetType == "Agency")
            .ToListAsync(cancellationToken);

        if (agencyReviews.Any())
        {
            _context.Reviews.RemoveRange(agencyReviews);
        }

        // 4. Reset user role if applicable
        if (agency.User != null && agency.User.Role == UserRole.TravelAgency)
        {
            agency.User.Role = UserRole.Tourist;
        }

        // 5. Delete the agency profile
        // Note: Tours, Trips, Likes, etc. are handled by DB Cascade (OnDelete Cascade) 
        // as configured in ApplicationDbContext for Agency-Tour/Trip relationships.
        _context.AgencyProfiles.Remove(agency);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
