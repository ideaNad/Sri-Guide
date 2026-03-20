using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Commands;

public record UpgradeToAgencyCommand(
    Guid UserId,
    string CompanyName,
    string CompanyEmail,
    string RegNumber,
    string Phone,
    string WhatsApp
) : IRequest<bool>;

public class UpgradeToAgencyCommandHandler : IRequestHandler<UpgradeToAgencyCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpgradeToAgencyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpgradeToAgencyCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
        if (user == null) throw new Exception("User not found");

        if (user.Role != UserRole.Guide) throw new Exception("Only guides can upgrade to Travel Agency");

        // Check if agency profile already exists
        var existingAgency = await _context.AgencyProfiles
            .AnyAsync(a => a.UserId == request.UserId, cancellationToken);
        
        if (existingAgency) throw new Exception("User is already an agency or has a pending request");

        var agencyProfile = new AgencyProfile
        {
            UserId = user.Id,
            CompanyName = request.CompanyName,
            CompanyEmail = request.CompanyEmail,
            RegistrationNumber = request.RegNumber,
            Phone = request.Phone,
            WhatsApp = request.WhatsApp,
            VerificationStatus = VerificationStatus.Pending
        };

        _context.AgencyProfiles.Add(agencyProfile);
        
        // Update user role
        user.Role = UserRole.TravelAgency;
        
        // Link guide to this new agency
        var guideProfile = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == user.Id, cancellationToken);
        
        if (guideProfile != null)
        {
            guideProfile.AgencyId = agencyProfile.Id;
            guideProfile.AgencyRecruitmentStatus = RecruitmentStatus.Accepted;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
