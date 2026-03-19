using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Commands;

public record VerifyGuideCommand(Guid GuideProfileId, bool Approve) : IRequest<bool>;

public class VerifyGuideCommandHandler : IRequestHandler<VerifyGuideCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public VerifyGuideCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(VerifyGuideCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.Id == request.GuideProfileId, cancellationToken);
        
        if (guide == null) return false;

        if (request.Approve)
        {
            guide.VerificationStatus = VerificationStatus.Approved;
            guide.IsLegit = true;
            guide.IsVerified = true;
        }
        else
        {
            guide.VerificationStatus = VerificationStatus.Rejected;
            guide.IsLegit = false;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
