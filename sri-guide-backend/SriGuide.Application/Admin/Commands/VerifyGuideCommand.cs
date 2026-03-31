using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace SriGuide.Application.Admin.Commands;

public record VerifyGuideCommand(Guid GuideProfileId, bool Approve) : IRequest<bool>;

public class VerifyGuideCommandHandler : IRequestHandler<VerifyGuideCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public VerifyGuideCommandHandler(IApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
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

        // Delete the verification document after approval or rejection
        if (!string.IsNullOrEmpty(guide.RegistrationDocUrl))
        {
            try
            {
                var filePath = Path.Combine(_environment.WebRootPath, guide.RegistrationDocUrl.TrimStart('/'));
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete verification document for guide {guide.Id}: {ex.Message}");
            }
            finally
            {
                guide.RegistrationDocUrl = null;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
