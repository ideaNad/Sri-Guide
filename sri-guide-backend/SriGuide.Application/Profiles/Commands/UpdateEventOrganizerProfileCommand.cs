using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Profiles.Commands;

public record UpdateEventOrganizerProfileCommand : IRequest<bool>
{
    public Guid UserId { get; init; }
    public string? OrganizationName { get; init; }
    public string? Website { get; init; }
    public string? Bio { get; init; }
    public string? FacebookLink { get; init; }
    public string? InstagramLink { get; init; }
    public string? TwitterLink { get; init; }
    public string? TikTokLink { get; init; }
    public string? YouTubeLink { get; init; }
    public string? LinkedinLink { get; init; }
    public List<string>? Languages { get; init; }
    public List<string>? Specialties { get; init; }
    public List<string>? OperatingAreas { get; init; }
}

public class UpdateEventOrganizerProfileCommandHandler : IRequestHandler<UpdateEventOrganizerProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateEventOrganizerProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateEventOrganizerProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.EventOrganizerProfile)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null) return false;

        if (user.EventOrganizerProfile == null)
        {
            user.EventOrganizerProfile = new EventOrganizerProfile
            {
                UserId = user.Id,
                OrganizationName = request.OrganizationName ?? string.Empty,
                Website = request.Website,
                Bio = request.Bio,
                FacebookLink = request.FacebookLink,
                InstagramLink = request.InstagramLink,
                TwitterLink = request.TwitterLink,
                TikTokLink = request.TikTokLink,
                YouTubeLink = request.YouTubeLink,
                LinkedinLink = request.LinkedinLink,
                Languages = request.Languages,
                Specialties = request.Specialties,
                OperatingAreas = request.OperatingAreas
            };
            _context.EventOrganizerProfiles.Add(user.EventOrganizerProfile);
        }
        else
        {
            user.EventOrganizerProfile.OrganizationName = request.OrganizationName ?? user.EventOrganizerProfile.OrganizationName;
            user.EventOrganizerProfile.Website = request.Website;
            user.EventOrganizerProfile.Bio = request.Bio;
            user.EventOrganizerProfile.FacebookLink = request.FacebookLink;
            user.EventOrganizerProfile.InstagramLink = request.InstagramLink;
            user.EventOrganizerProfile.TwitterLink = request.TwitterLink;
            user.EventOrganizerProfile.TikTokLink = request.TikTokLink;
            user.EventOrganizerProfile.YouTubeLink = request.YouTubeLink;
            user.EventOrganizerProfile.LinkedinLink = request.LinkedinLink;
            user.EventOrganizerProfile.Languages = request.Languages;
            user.EventOrganizerProfile.Specialties = request.Specialties;
            user.EventOrganizerProfile.OperatingAreas = request.OperatingAreas;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
