using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Domain.Enums;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Trips.Commands;

public record UpdateTripCommand(
    Guid TripId,
    Guid? GuideId,
    string Title,
    string Location,
    string Description,
    DateTime? Date,
    Guid? AgencyId = null
) : IRequest<bool>;

public class UpdateTripCommandHandler : IRequestHandler<UpdateTripCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdateTripCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<bool> Handle(UpdateTripCommand request, CancellationToken cancellationToken)
    {
        Trip? trip = null;
        Guid? tripOwnerId = null;
        if (request.AgencyId != null)
        {
            var agency = await _context.AgencyProfiles
                .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .FirstOrDefaultAsync(a => a.Id == request.AgencyId, cancellationToken);
            
            if (agency != null)
            {
                var guideUserIds = agency.Guides.Select(g => g.UserId).ToList();
                var tripToUpdate = await _context.Trips
                    .FirstOrDefaultAsync(t => t.Id == request.TripId && 
                        (t.AgencyId == agency.Id || guideUserIds.Contains(t.GuideId ?? Guid.Empty)), 
                        cancellationToken);
                trip = tripToUpdate;
            }
        }
        else
        {
            trip = await _context.Trips
                .FirstOrDefaultAsync(t => t.Id == request.TripId && t.GuideId == request.GuideId,
                    cancellationToken);
        }

        if (trip == null) return false;

        trip.Title = request.Title;
        trip.Slug = await _slugService.CreateUniqueSlugAsync<Trip>(request.Title, trip.Id, cancellationToken);
        trip.Location = request.Location;
        trip.Description = request.Description;
        trip.Date = request.Date.HasValue ? DateTime.SpecifyKind(request.Date.Value, DateTimeKind.Utc) : null;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
