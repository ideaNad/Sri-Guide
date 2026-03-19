using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Commands;

public record UpdateGuideProfileCommand(
    Guid UserId,
    string? Bio,
    List<string>? Languages,
    decimal? DailyRate,
    decimal? HourlyRate,
    bool? ContactForPrice,
    string? Specialty,
    string? PhoneNumber,
    string? WhatsAppNumber,
    string? YouTubeLink,
    string? TikTokLink,
    string? FacebookLink,
    string? InstagramLink
) : IRequest<bool>;

public class UpdateGuideProfileCommandHandler : IRequestHandler<UpdateGuideProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateGuideProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateGuideProfileCommand request, CancellationToken cancellationToken)
    {
        var guideProfile = await _context.GuideProfiles
            .FirstOrDefaultAsync(g => g.UserId == request.UserId, cancellationToken);

        if (guideProfile == null)
        {
            // If they are a guide but no profile, create it
            var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
            if (user == null || user.Role != UserRole.Guide) throw new Exception("Guide not found or user is not a guide");

            guideProfile = new SriGuide.Domain.Entities.GuideProfile { UserId = request.UserId };
            _context.GuideProfiles.Add(guideProfile);
        }

        guideProfile.Bio = request.Bio ?? guideProfile.Bio;
        if (request.Languages != null) guideProfile.Languages = request.Languages;
        guideProfile.DailyRate = request.DailyRate ?? guideProfile.DailyRate;
        guideProfile.HourlyRate = request.HourlyRate ?? guideProfile.HourlyRate;
        guideProfile.ContactForPrice = request.ContactForPrice ?? guideProfile.ContactForPrice;
        guideProfile.Specialty = request.Specialty ?? guideProfile.Specialty;
        guideProfile.PhoneNumber = request.PhoneNumber ?? guideProfile.PhoneNumber;
        guideProfile.WhatsAppNumber = request.WhatsAppNumber ?? guideProfile.WhatsAppNumber;
        guideProfile.YouTubeLink = request.YouTubeLink ?? guideProfile.YouTubeLink;
        guideProfile.TikTokLink = request.TikTokLink ?? guideProfile.TikTokLink;
        guideProfile.FacebookLink = request.FacebookLink ?? guideProfile.FacebookLink;
        guideProfile.InstagramLink = request.InstagramLink ?? guideProfile.InstagramLink;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
