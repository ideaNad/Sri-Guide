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
            .Include(u => u.EventOrganizerProfile)
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
            user.CreatedAt,
            user.OnboardingCompleted,
            user.Interests,
            user.Budget,
            user.TravelDuration,
            user.PreferredLocation,
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
                guideProfile.LinkedinLink,
                guideProfile.RegistrationNumber,
                guideProfile.LicenseExpirationDate?.ToString("yyyy-MM-dd")
            ) : null,
            agencyProfile != null ? new AgencyProfileDto(
                agencyProfile.Id,
                agencyProfile.CompanyName,
                agencyProfile.Bio,
                agencyProfile.CompanyEmail,
                agencyProfile.RegistrationNumber,
                agencyProfile.Phone,
                agencyProfile.WhatsApp,
                agencyProfile.CompanyAddress,
                agencyProfile.Specialties,
                agencyProfile.Languages,
                agencyProfile.OperatingRegions,
                agencyProfile.YouTubeLink,
                agencyProfile.TikTokLink,
                agencyProfile.FacebookLink,
                agencyProfile.InstagramLink,
                agencyProfile.TwitterLink,
                agencyProfile.LinkedinLink,
                agencyProfile.IsVerified,
                agencyProfile.VerificationStatus
            ) : null,
            user.EventOrganizerProfile != null ? new EventOrganizerProfileDto(
                user.EventOrganizerProfile.OrganizationName,
                user.EventOrganizerProfile.Bio,
                user.EventOrganizerProfile.Website,
                user.EventOrganizerProfile.FacebookLink,
                user.EventOrganizerProfile.InstagramLink,
                user.EventOrganizerProfile.TwitterLink,
                user.EventOrganizerProfile.TikTokLink,
                user.EventOrganizerProfile.YouTubeLink,
                user.EventOrganizerProfile.LinkedinLink,
                user.EventOrganizerProfile.Languages,
                user.EventOrganizerProfile.Specialties,
                user.EventOrganizerProfile.OperatingAreas,
                user.EventOrganizerProfile.IsVerified
            ) : null
        );
    }
}
