using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Commands;

public record DeleteGuideCommand(Guid GuideProfileId) : IRequest<bool>;

public class DeleteGuideCommandHandler : IRequestHandler<DeleteGuideCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteGuideCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteGuideCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.GuideProfiles
            .Include(g => g.User)
            .FirstOrDefaultAsync(g => g.Id == request.GuideProfileId, cancellationToken);

        if (guide == null) return false;

        // 1. Get all trips associated with this guide to delete their reviews
        // (Note: Trips can be associated with GuideProfile.UserId or GuideProfile.Id depending on implementation, 
        // but Trip.GuideId is Guid? and usually refers to User.Id in this codebase)
        var guideUserId = guide.UserId;
        var tripIds = await _context.Trips
            .Where(t => t.GuideId == guideUserId)
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
            
            // Delete trips manually if DB cascade is not configured for GuideId (since it's nullable)
            var trips = await _context.Trips
                .Where(t => t.GuideId == guideUserId)
                .ToListAsync(cancellationToken);
            _context.Trips.RemoveRange(trips);
        }

        // 2. Delete reviews for the guide profile itself
        var guideReviews = await _context.Reviews
            .Where(r => r.TargetId == guide.Id && r.TargetType == "Guide")
            .ToListAsync(cancellationToken);

        if (guideReviews.Any())
        {
            _context.Reviews.RemoveRange(guideReviews);
        }

        // 3. Reset user role if applicable
        if (guide.User != null && guide.User.Role == UserRole.Guide)
        {
            guide.User.Role = UserRole.Tourist;
        }

        // 4. Delete the guide profile
        _context.GuideProfiles.Remove(guide);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
