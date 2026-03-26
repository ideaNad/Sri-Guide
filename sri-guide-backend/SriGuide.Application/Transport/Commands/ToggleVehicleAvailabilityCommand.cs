using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Transport.Commands;

public record ToggleVehicleAvailabilityCommand(Guid VehicleId, Guid UserId) : IRequest<bool>;

public class ToggleVehicleAvailabilityCommandHandler : IRequestHandler<ToggleVehicleAvailabilityCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleVehicleAvailabilityCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleVehicleAvailabilityCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.TransportProfile)
            .FirstOrDefaultAsync(v => v.Id == request.VehicleId, cancellationToken);

        if (vehicle == null) throw new Exception("Vehicle not found");
        if (vehicle.TransportProfile?.UserId != request.UserId) throw new Exception("Unauthorized");

        vehicle.IsAvailable = !vehicle.IsAvailable;
        await _context.SaveChangesAsync(cancellationToken);

        return vehicle.IsAvailable;
    }
}
