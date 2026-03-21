using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Trips.Commands;

public class ToggleTourStatusCommandHandler : IRequestHandler<ToggleTourStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleTourStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleTourStatusCommand request, CancellationToken cancellationToken)
    {
        var tour = await _context.Tours
            .FirstOrDefaultAsync(t => t.Id == request.TourId && t.AgencyId == request.AgencyId, cancellationToken);

        if (tour == null) return false;

        tour.IsActive = !tour.IsActive;
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
