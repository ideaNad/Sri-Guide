using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Transport.Commands;

public record ToggleTransportAvailabilityCommand(Guid UserId) : IRequest<bool>;

public class ToggleTransportAvailabilityCommandHandler : IRequestHandler<ToggleTransportAvailabilityCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleTransportAvailabilityCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleTransportAvailabilityCommand request, CancellationToken cancellationToken)
    {
        var profile = await _context.TransportProfiles
            .FirstOrDefaultAsync(p => p.UserId == request.UserId, cancellationToken);

        if (profile == null)
            throw new Exception("Transport profile not found.");

        profile.IsAvailable = !profile.IsAvailable;
        await _context.SaveChangesAsync(cancellationToken);

        return profile.IsAvailable;
    }
}
