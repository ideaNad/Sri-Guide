using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Profiles.Queries;

public record GetUserProfileQuery(Guid UserId) : IRequest<UserProfileDto>;

public class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, UserProfileDto>
{
    private readonly IApplicationDbContext _context;

    public GetUserProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileDto> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.GuideProfile)
                .ThenInclude(g => g!.Agency)
            .Include(u => u.AgencyProfile)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            
        if (user == null) throw new Exception("User not found");

        var guideProfile = user.GuideProfile;
        var agencyProfile = user.AgencyProfile;

        return new UserProfileDto(
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.IsVerified,
            user.ProfileImageUrl,
            guideProfile != null ? new GuideProfileDto(
                guideProfile.Bio,
                guideProfile.Languages,
                guideProfile.DailyRate,
                guideProfile.HourlyRate,
                guideProfile.VerificationStatus,
                guideProfile.ContactForPrice,
                guideProfile.AgencyId,
                guideProfile.Agency?.CompanyName,
                guideProfile.Specialties,
                guideProfile.OperatingAreas,
                guideProfile.PhoneNumber,
                guideProfile.WhatsAppNumber,
                guideProfile.YouTubeLink,
                guideProfile.TikTokLink,
                guideProfile.FacebookLink,
                guideProfile.InstagramLink,
                guideProfile.TwitterLink,
                guideProfile.LinkedinLink
            ) : null,
            agencyProfile != null ? new AgencyProfileDto(
                agencyProfile.CompanyName,
                agencyProfile.CompanyEmail,
                agencyProfile.RegistrationNumber,
                agencyProfile.Phone,
                agencyProfile.WhatsApp,
                agencyProfile.VerificationStatus
            ) : null
        );
    }
}
