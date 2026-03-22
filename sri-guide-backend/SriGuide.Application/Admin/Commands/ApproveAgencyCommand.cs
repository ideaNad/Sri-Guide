using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Commands;

public record ApproveAgencyCommand(Guid AgencyProfileId) : IRequest<bool>;

public class ApproveAgencyCommandHandler : IRequestHandler<ApproveAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ApproveAgencyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ApproveAgencyCommand request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == request.AgencyProfileId, cancellationToken);
        
        if (agency == null) return false;

        agency.VerificationStatus = VerificationStatus.Approved;
        agency.IsVerified = true;

        if (agency.User != null)
        {
            agency.User.Role = UserRole.TravelAgency;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
