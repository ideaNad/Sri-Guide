using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

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
        var trip = await _context.Trips
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == request.TripId && 
                (request.GuideId != null ? t.GuideId == request.GuideId : t.AgencyId == request.AgencyId), 
                cancellationToken);
            
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
