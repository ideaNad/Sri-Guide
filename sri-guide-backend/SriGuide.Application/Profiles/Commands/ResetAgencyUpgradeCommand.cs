using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Commands;

public record ResetAgencyUpgradeCommand(Guid UserId) : IRequest<bool>;

public class ResetAgencyUpgradeCommandHandler : IRequestHandler<ResetAgencyUpgradeCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ResetAgencyUpgradeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ResetAgencyUpgradeCommand request, CancellationToken cancellationToken)
    {
        var agencyProfile = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agencyProfile == null) return false;

        if (agencyProfile.VerificationStatus != VerificationStatus.Rejected)
        {
            throw new Exception("Only rejected applications can be reset.");
        }

        // Clean up guide profile links
        var guideProfile = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == request.UserId, cancellationToken);

        if (guideProfile != null)
        {
            guideProfile.AgencyId = null;
            guideProfile.AgencyRecruitmentStatus = RecruitmentStatus.None;
        }

        _context.AgencyProfiles.Remove(agencyProfile);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
