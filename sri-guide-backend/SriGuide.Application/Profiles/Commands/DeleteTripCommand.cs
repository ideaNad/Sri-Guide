using MediatR;
using Microsoft.EntityFrameworkCore;
using System.IO;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

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
        Trip? trip = null;
        if (request.AgencyId != null)
        {
            var agency = await _context.AgencyProfiles
                .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .FirstOrDefaultAsync(a => a.Id == request.AgencyId, cancellationToken);
            
            if (agency != null)
            {
                var guideUserIds = agency.Guides.Select(g => g.UserId).ToList();
                trip = await _context.Trips
                    .FirstOrDefaultAsync(t => t.Id == request.Id && 
                        (t.AgencyId == agency.Id || guideUserIds.Contains(t.GuideId ?? Guid.Empty)), 
                        cancellationToken);
            }
        }
        else
        {
            trip = await _context.Trips
                .FirstOrDefaultAsync(t => t.Id == request.Id && t.GuideId == request.GuideId, 
                    cancellationToken);
        }

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
