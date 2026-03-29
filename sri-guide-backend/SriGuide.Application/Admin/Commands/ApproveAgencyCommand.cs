using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace SriGuide.Application.Admin.Commands;

public record ApproveAgencyCommand(Guid AgencyProfileId) : IRequest<bool>;

public class ApproveAgencyCommandHandler : IRequestHandler<ApproveAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ApproveAgencyCommandHandler(IApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
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

        // Delete the verification document after approval
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
                // Log the exception if a logger was available, but don't fail the approval
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
