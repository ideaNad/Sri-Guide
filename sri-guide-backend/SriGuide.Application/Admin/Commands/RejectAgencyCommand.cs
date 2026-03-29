using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace SriGuide.Application.Admin.Commands;

public record RejectAgencyCommand(Guid AgencyProfileId) : IRequest<bool>;

public class RejectAgencyCommandHandler : IRequestHandler<RejectAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public RejectAgencyCommandHandler(IApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
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

        // Delete the verification document after rejection
        if (!string.IsNullOrEmpty(agency.RegistrationDocUrl))
        {
            try
            {
                var filePath = Path.Combine(_environment.WebRootPath, agency.RegistrationDocUrl.TrimStart('/'));
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                // Log the exception if a logger was available, but don't fail the rejection
                Console.WriteLine($"Failed to delete verification document: {ex.Message}");
            }
            finally
            {
                agency.RegistrationDocUrl = null;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
