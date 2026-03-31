using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Trips.Commands;

public record DeleteTripImageCommand(
    Guid TripId,
    Guid? GuideId,
    string ImageUrl,
    Guid? AgencyId = null
) : IRequest<bool>;

public class DeleteTripImageCommandHandler : IRequestHandler<DeleteTripImageCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteTripImageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteTripImageCommand request, CancellationToken cancellationToken)
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
                    .Include(t => t.Images)
                    .FirstOrDefaultAsync(t => t.Id == request.TripId && 
                        (t.AgencyId == agency.Id || guideUserIds.Contains(t.GuideId ?? Guid.Empty)), 
                        cancellationToken);
            }
        }
        else
        {
            trip = await _context.Trips
                .Include(t => t.Images)
                .FirstOrDefaultAsync(t => t.Id == request.TripId && t.GuideId == request.GuideId, 
                    cancellationToken);
        }
            
        if (trip == null) return false;

        var imageToRemove = trip.Images.FirstOrDefault(i => i.ImageUrl == request.ImageUrl);
        if (imageToRemove != null)
        {
            _context.TripImages.Remove(imageToRemove);
            
            await _context.SaveChangesAsync(cancellationToken);
        }
        
        return true;
    }
}
