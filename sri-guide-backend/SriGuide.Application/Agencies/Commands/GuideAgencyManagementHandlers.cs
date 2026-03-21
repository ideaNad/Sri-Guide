using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Agencies.Commands;

public class GuideAgencyManagementHandler : 
    IRequestHandler<AddGuideToAgencyCommand, bool>,
    IRequestHandler<RemoveGuideFromAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public GuideAgencyManagementHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AddGuideToAgencyCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == request.GuideId, cancellationToken);

        if (guide == null) return false;

        var agency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.Id == request.AgencyId, cancellationToken);

        if (agency == null) return false;

        guide.AgencyId = agency.Id;
        guide.AgencyRecruitmentStatus = RecruitmentStatus.Requested;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> Handle(RemoveGuideFromAgencyCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.GuideProfiles
            .Include(g => g.Agency)
            .FirstOrDefaultAsync(g => g.UserId == request.GuideId || g.Id == request.GuideId, cancellationToken);

        if (guide == null) return false;

        // Verify the guide belongs to this agency
        if (guide.AgencyId != request.AgencyId) return false;

        guide.AgencyId = null;
        guide.AgencyRecruitmentStatus = RecruitmentStatus.None;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
