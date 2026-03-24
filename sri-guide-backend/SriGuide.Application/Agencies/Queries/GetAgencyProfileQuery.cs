using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Agencies.Queries;

public record GetAgencyProfileQuery(Guid UserId) : IRequest<AgencyProfileDto?>;

public class GetAgencyProfileQueryHandler : IRequestHandler<GetAgencyProfileQuery, AgencyProfileDto?>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AgencyProfileDto?> Handle(GetAgencyProfileQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return null;

        return new AgencyProfileDto(
            agency.Id,
            agency.CompanyName,
            agency.Bio,
            agency.CompanyEmail,
            agency.RegistrationNumber,
            agency.Phone,
            agency.WhatsApp,
            agency.CompanyAddress,
            agency.Specialties,
            agency.Languages,
            agency.OperatingRegions,
            agency.YouTubeLink,
            agency.TikTokLink,
            agency.FacebookLink,
            agency.InstagramLink,
            agency.TwitterLink,
            agency.LinkedinLink,
            agency.IsVerified,
            agency.VerificationStatus,
            agency.User?.ProfileImageUrl
        );
    }
}
