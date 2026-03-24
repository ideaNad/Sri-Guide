using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Admin.Commands;

public record DeleteUserCommand(Guid UserId) : IRequest<bool>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.AgencyProfile)
            .Include(u => u.GuideProfile)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null) return false;

        // 1. Delete all bookings where this user is involved
        var bookings = await _context.Bookings
            .Where(b => b.CustomerId == user.Id || b.GuideId == user.Id)
            .ToListAsync(cancellationToken);
        
        if (bookings.Any())
        {
            _context.Bookings.RemoveRange(bookings);
        }

        // 2. Delete all reviews authored by this user
        var authoredReviews = await _context.Reviews
            .Where(r => r.UserId == user.Id)
            .ToListAsync(cancellationToken);
        
        if (authoredReviews.Any())
        {
            _context.Reviews.RemoveRange(authoredReviews);
        }

        // 3. Delete polymorphic reviews targeting this user (if they are a guide or agency)
        var targetIds = new List<Guid> { user.Id };
        if (user.AgencyProfile != null) targetIds.Add(user.AgencyProfile.Id);
        if (user.GuideProfile != null) targetIds.Add(user.GuideProfile.Id);

        var targetReviews = await _context.Reviews
            .Where(r => targetIds.Contains(r.TargetId))
            .ToListAsync(cancellationToken);
        
        if (targetReviews.Any())
        {
            _context.Reviews.RemoveRange(targetReviews);
        }

        // 4. Delete agency tours and trips if they exist (manual cleanup of reviews)
        if (user.AgencyProfile != null)
        {
            var tourIds = await _context.Tours
                .Where(t => t.AgencyId == user.AgencyProfile.Id)
                .Select(t => t.Id)
                .ToListAsync(cancellationToken);

            if (tourIds.Any())
            {
                var tourReviews = await _context.Reviews
                    .Where(r => tourIds.Contains(r.TargetId) && r.TargetType == "Tour")
                    .ToListAsync(cancellationToken);
                _context.Reviews.RemoveRange(tourReviews);
            }
        }

        // 5. Delete trips associated with the user/guide
        var tripIds = await _context.Trips
            .Where(t => t.GuideId == user.Id || (user.AgencyProfile != null && t.AgencyId == user.AgencyProfile.Id))
            .Select(t => t.Id)
            .ToListAsync(cancellationToken);

        if (tripIds.Any())
        {
            var tripReviews = await _context.Reviews
                .Where(r => tripIds.Contains(r.TargetId) && (r.TargetType == "Trip" || r.TargetType == "Adventure"))
                .ToListAsync(cancellationToken);
            _context.Reviews.RemoveRange(tripReviews);
            
            // Delete trips explicitly since they might not cascade perfectly if nullable
            var trips = await _context.Trips
                .Where(t => t.GuideId == user.Id || (user.AgencyProfile != null && t.AgencyId == user.AgencyProfile.Id))
                .ToListAsync(cancellationToken);
            _context.Trips.RemoveRange(trips);
        }

        // 6. Delete the user (AgencyProfile/GuideProfile will cascade if set to Cascade in DB)
        // Note: ApplicationDbContext has Cascade for Agency/Guide profiles on User deletion.
        _context.Users.Remove(user);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
