using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Transport.Commands;

public record CreateVehicleCommand(
    Guid UserId,
    string VehicleType,
    string Brand,
    string Model,
    int Year,
    int PassengerCapacity,
    int LuggageCapacity,
    bool HasAc,
    string? VehicleImageUrl,
    bool IsAvailable = true,
    bool DriverIncluded = false
) : IRequest<Guid>;

public class CreateVehicleCommandHandler : IRequestHandler<CreateVehicleCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateVehicleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
    {
        var profile = await _context.TransportProfiles
            .FirstOrDefaultAsync(p => p.UserId == request.UserId, cancellationToken);

        if (profile == null)
            throw new Exception("Transport profile not found. Please complete your profile first.");

        var vehicle = new SriGuide.Domain.Entities.Vehicle
        {
            TransportProfileId = profile.Id,
            VehicleType = request.VehicleType,
            Brand = request.Brand,
            Model = request.Model,
            Year = request.Year,
            PassengerCapacity = request.PassengerCapacity,
            LuggageCapacity = request.LuggageCapacity,
            HasAc = request.HasAc,
            VehicleImageUrl = request.VehicleImageUrl,
            IsAvailable = request.IsAvailable,
            DriverIncluded = request.DriverIncluded
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return vehicle.Id;
    }
}
