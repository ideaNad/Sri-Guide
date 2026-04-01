using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Agencies.Commands;

public record UpdateAgencyProfileCommand(
    Guid UserId,
    string CompanyName,
    string? Bio = null,
    string? Phone = null,
    string? WhatsApp = null,
    string? CompanyAddress = null,
    List<string>? Specialties = null,
    List<string>? Languages = null,
    List<string>? OperatingRegions = null,
    string? FacebookLink = null,
    string? InstagramLink = null,
    string? LinkedinLink = null,
    string? TikTokLink = null,
    string? TwitterLink = null,
    string? YouTubeLink = null,
    string? AgencyProfileImageUrl = null
) : IRequest<bool>;

public class UpdateAgencyProfileCommandHandler : IRequestHandler<UpdateAgencyProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdateAgencyProfileCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<bool> Handle(UpdateAgencyProfileCommand request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) throw new Exception("Agency profile not found");

        agency.CompanyName = request.CompanyName ?? agency.CompanyName;
        agency.Slug = !string.IsNullOrEmpty(request.CompanyName) 
            ? await _slugService.CreateUniqueSlugAsync<AgencyProfile>(request.CompanyName, agency.Id, cancellationToken) 
            : agency.Slug;
        
        agency.Bio = request.Bio ?? agency.Bio;
        agency.Phone = request.Phone ?? agency.Phone;
        agency.WhatsApp = request.WhatsApp ?? agency.WhatsApp;
        agency.CompanyAddress = request.CompanyAddress ?? agency.CompanyAddress;
        
        if (request.Specialties != null) agency.Specialties = request.Specialties;
        if (request.Languages != null) agency.Languages = request.Languages;
        if (request.OperatingRegions != null) agency.OperatingRegions = request.OperatingRegions;
        
        agency.FacebookLink = request.FacebookLink ?? agency.FacebookLink;
        agency.InstagramLink = request.InstagramLink ?? agency.InstagramLink;
        agency.LinkedinLink = request.LinkedinLink ?? agency.LinkedinLink;
        agency.TikTokLink = request.TikTokLink ?? agency.TikTokLink;
        agency.TwitterLink = request.TwitterLink ?? agency.TwitterLink;
        agency.YouTubeLink = request.YouTubeLink ?? agency.YouTubeLink;
        agency.AgencyProfileImageUrl = request.AgencyProfileImageUrl ?? agency.AgencyProfileImageUrl;
        
        agency.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
