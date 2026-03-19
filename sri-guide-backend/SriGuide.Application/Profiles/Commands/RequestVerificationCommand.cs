using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Commands;

public record RequestVerificationCommand(Guid UserId, string RegistrationNumber, DateTime LicenseExpirationDate) : IRequest<bool>
{
    public Guid UserId { get; init; } // Set by controller
}

public class RequestVerificationCommandHandler : IRequestHandler<RequestVerificationCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RequestVerificationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RequestVerificationCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == request.UserId, cancellationToken);
        
        if (guide == null) return false;

        guide.RegistrationNumber = request.RegistrationNumber;
        guide.LicenseExpirationDate = DateTime.SpecifyKind(request.LicenseExpirationDate, DateTimeKind.Utc);
        guide.VerificationStatus = VerificationStatus.Pending;
        
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
