using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Agencies.Commands;

public record UpdateAgencyProfileCommand(
    Guid UserId,
    string CompanyName,
    string? Bio,
    string? Phone,
    string? WhatsApp,
    string? FacebookLink,
    string? InstagramLink,
    string? LinkedinLink,
    string? TikTokLink,
    string? TwitterLink,
    string? YouTubeLink
) : IRequest<bool>;

public class UpdateAgencyProfileCommandHandler : IRequestHandler<UpdateAgencyProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateAgencyProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateAgencyProfileCommand request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) throw new Exception("Agency profile not found");

        agency.CompanyName = request.CompanyName;
        agency.Slug = SlugHelper.GenerateSlug(request.CompanyName);
        agency.Bio = request.Bio;
        agency.Phone = request.Phone;
        agency.WhatsApp = request.WhatsApp;
        agency.FacebookLink = request.FacebookLink;
        agency.InstagramLink = request.InstagramLink;
        agency.LinkedinLink = request.LinkedinLink;
        agency.TikTokLink = request.TikTokLink;
        agency.TwitterLink = request.TwitterLink;
        agency.YouTubeLink = request.YouTubeLink;
        agency.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
