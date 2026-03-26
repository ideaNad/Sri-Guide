using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Transport.Commands.ToggleVehicleLike;

public record ToggleVehicleLikeCommand(Guid VehicleId, Guid UserId) : IRequest<bool>;

public class ToggleVehicleLikeCommandHandler : IRequestHandler<ToggleVehicleLikeCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleVehicleLikeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleVehicleLikeCommand request, CancellationToken cancellationToken)
    {
        var existingLike = await _context.VehicleLikes
            .FirstOrDefaultAsync(l => l.VehicleId == request.VehicleId && l.UserId == request.UserId, cancellationToken);

        if (existingLike != null)
        {
            _context.VehicleLikes.Remove(existingLike);
            await _context.SaveChangesAsync(cancellationToken);
            return false; // Unliked
        }

        var like = new VehicleLike
        {
            VehicleId = request.VehicleId,
            UserId = request.UserId
        };

        _context.VehicleLikes.Add(like);
        await _context.SaveChangesAsync(cancellationToken);
        return true; // Liked
    }
}
