using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Transport.Commands;

public record UpdateVehicleCommand(
    Guid VehicleId,
    Guid UserId,
    string VehicleType,
    string Brand,
    string Model,
    int Year,
    int PassengerCapacity,
    int LuggageCapacity,
    bool HasAc,
    string? VehicleImageUrl,
    bool IsAvailable,
    bool DriverIncluded
) : IRequest<bool>;

public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateVehicleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.TransportProfile)
            .FirstOrDefaultAsync(v => v.Id == request.VehicleId, cancellationToken);

        if (vehicle == null) throw new Exception("Vehicle not found");
        if (vehicle.TransportProfile?.UserId != request.UserId) throw new Exception("Unauthorized");

        vehicle.VehicleType = request.VehicleType;
        vehicle.Brand = request.Brand;
        vehicle.Model = request.Model;
        vehicle.Year = request.Year;
        vehicle.PassengerCapacity = request.PassengerCapacity;
        vehicle.LuggageCapacity = request.LuggageCapacity;
        vehicle.HasAc = request.HasAc;
        vehicle.VehicleImageUrl = request.VehicleImageUrl ?? vehicle.VehicleImageUrl;
        vehicle.IsAvailable = request.IsAvailable;
        vehicle.DriverIncluded = request.DriverIncluded;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
