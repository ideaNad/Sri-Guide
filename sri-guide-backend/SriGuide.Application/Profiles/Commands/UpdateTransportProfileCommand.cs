using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Commands;

public record UpdateTransportProfileCommand(
    Guid UserId,
    string BusinessName,
    string? Description,
    string? Phone,
    string? ProfileImageUrl,
    string? District,
    string? Province,
    double? Latitude,
    double? Longitude,
    bool? IsAvailable,
    string? WhatsAppNumber
) : IRequest<bool>;

public class UpdateTransportProfileCommandHandler : IRequestHandler<UpdateTransportProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateTransportProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateTransportProfileCommand request, CancellationToken cancellationToken)
    {
        var transportProfile = await _context.TransportProfiles
            .FirstOrDefaultAsync(t => t.UserId == request.UserId, cancellationToken);

        if (transportProfile == null)
        {
            var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
            if (user == null || user.Role != UserRole.TransportProvider)
                throw new Exception("User not found or is not a transport provider");

            transportProfile = new SriGuide.Domain.Entities.TransportProfile { UserId = request.UserId };
            _context.TransportProfiles.Add(transportProfile);
        }

        transportProfile.BusinessName = request.BusinessName ?? transportProfile.BusinessName;
        transportProfile.Description = request.Description ?? transportProfile.Description;
        transportProfile.Phone = request.Phone ?? transportProfile.Phone;
        transportProfile.ProfileImageUrl = request.ProfileImageUrl ?? transportProfile.ProfileImageUrl;
        transportProfile.District = request.District ?? transportProfile.District;
        transportProfile.Province = request.Province ?? transportProfile.Province;
        transportProfile.Latitude = request.Latitude ?? transportProfile.Latitude;
        transportProfile.Longitude = request.Longitude ?? transportProfile.Longitude;
        transportProfile.IsAvailable = request.IsAvailable ?? transportProfile.IsAvailable;
        transportProfile.WhatsAppNumber = request.WhatsAppNumber ?? transportProfile.WhatsAppNumber;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
