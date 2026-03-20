using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Agencies.Commands;

public class RespondToAgencyOfferHandler : IRequestHandler<RespondToAgencyOfferCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RespondToAgencyOfferHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RespondToAgencyOfferCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == request.GuideUserId, cancellationToken);

        if (guide == null || guide.AgencyRecruitmentStatus != RecruitmentStatus.Requested)
            return false;

        if (request.Accept)
        {
            guide.AgencyRecruitmentStatus = RecruitmentStatus.Accepted;
        }
        else
        {
            guide.AgencyId = null;
            guide.AgencyRecruitmentStatus = RecruitmentStatus.Rejected;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
