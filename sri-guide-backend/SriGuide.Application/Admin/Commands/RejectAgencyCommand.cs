using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Commands;

public record RejectAgencyCommand(Guid AgencyProfileId) : IRequest<bool>;

public class RejectAgencyCommandHandler : IRequestHandler<RejectAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RejectAgencyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RejectAgencyCommand request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == request.AgencyProfileId, cancellationToken);
        
        if (agency == null) return false;

        agency.VerificationStatus = VerificationStatus.Rejected;
        
        // Optionally revert user role back to Guide if it was already changed
        if (agency.User != null && agency.User.Role == UserRole.TravelAgency)
        {
            agency.User.Role = UserRole.Guide;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
