using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Discovery.Queries;

public record DiscoveryItemDto(
    Guid Id,
    string Title,
    string? Subtitle,
    string Image,
    string? Location,
    decimal? Rating,
    int Reviews,
    string Type,
    string[] Tags,
    string? Phone,
    string? Email,
    string? WhatsApp
);

public record GetDiscoveryQuery(string? Query, string? Type) : IRequest<List<DiscoveryItemDto>>;

public class GetDiscoveryQueryHandler : IRequestHandler<GetDiscoveryQuery, List<DiscoveryItemDto>>
{
    private readonly IApplicationDbContext _context;

    public GetDiscoveryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DiscoveryItemDto>> Handle(GetDiscoveryQuery request, CancellationToken cancellationToken)
    {
        var results = new List<DiscoveryItemDto>();

        // If type is guide or null, add guides
        if (request.Type == null || request.Type == "guide")
        {
            var guides = await _context.GuideProfiles
                .Include(g => g.User)
                .Where(g => g.VerificationStatus == VerificationStatus.Approved) // Only approved
                .Where(g => string.IsNullOrEmpty(request.Query) || 
                            g.User.FullName.Contains(request.Query) || 
                            (g.Bio != null && g.Bio.Contains(request.Query)))
                .Select(g => new DiscoveryItemDto(
                    g.Id,
                    g.User.FullName,
                    g.Bio,
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800", // Placeholder
                    "Sri Lanka", // Default if no location field yet
                    5.0m, // Placeholder rating
                    0,
                    "guide",
                    g.Languages.ToArray(),
                    g.User.Email, // We should use a specific phone field later
                    g.User.Email,
                    null
                ))
                .ToListAsync(cancellationToken);
            
            results.AddRange(guides);
        }

        // If type is agency or null, add agencies
        if (request.Type == null || request.Type == "agency")
        {
            var agencies = await _context.AgencyProfiles
                .Include(a => a.User)
                .Where(a => a.VerificationStatus == VerificationStatus.Approved)
                .Where(a => string.IsNullOrEmpty(request.Query) || 
                            a.CompanyName.Contains(request.Query) || 
                            a.User.FullName.Contains(request.Query))
                .Select(a => new DiscoveryItemDto(
                    a.Id,
                    a.CompanyName,
                    "Official Travel Agency",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800", // Placeholder
                    "Sri Lanka",
                    5.0m,
                    0,
                    "agency",
                    new string[] { "Certified", "Premium" },
                    a.Phone,
                    a.CompanyEmail,
                    a.WhatsApp
                ))
                .ToListAsync(cancellationToken);
            
            results.AddRange(agencies);
        }

        return results;
    }
}
