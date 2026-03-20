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
    string? WhatsApp,
    bool IsLegit = false,
    string? AgencyName = null,
    decimal? Price = null,
    string? Date = null
);

public record GetDiscoveryQuery(
    string? Query, 
    string? Type,
    List<string>? Languages = null,
    List<string>? Specialties = null,
    List<string>? Areas = null
) : IRequest<List<DiscoveryItemDto>>;

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
        var isGuideType = string.IsNullOrEmpty(request.Type) || string.Equals(request.Type, "guide", StringComparison.OrdinalIgnoreCase);
        if (isGuideType)
        {
            var guidesRaw = await _context.GuideProfiles
                .Include(g => g.User)
                .Include(g => g.Trips)
                .Include(g => g.Agency)
                .Where(g => string.IsNullOrEmpty(request.Query) || 
                            g.User.FullName.Contains(request.Query) || 
                            (g.Bio != null && g.Bio.Contains(request.Query)))
                .ToListAsync(cancellationToken);

            if (request.Languages != null && request.Languages.Any())
            {
                guidesRaw = guidesRaw.Where(g => g.Languages != null && request.Languages.Any(l => g.Languages.Contains(l))).ToList();
            }
            if (request.Specialties != null && request.Specialties.Any())
            {
                guidesRaw = guidesRaw.Where(g => g.Specialties != null && request.Specialties.Any(s => g.Specialties.Contains(s))).ToList();
            }
            if (request.Areas != null && request.Areas.Any())
            {
                guidesRaw = guidesRaw.Where(g => g.OperatingAreas != null && request.Areas.Any(a => g.OperatingAreas.Contains(a))).ToList();
            }

            foreach (var g in guidesRaw)
            {
                var tripIds = g.Trips.Select(t => t.Id).ToList();
                var reviews = await _context.Reviews
                    .Where(r => r.TargetType == "Trip" && tripIds.Contains(r.TargetId))
                    .ToListAsync(cancellationToken);
                
                var avgRating = reviews.Any() ? (decimal)Math.Round(reviews.Average(r => (double)r.Rating), 1) : 5.0m;
                var reviewCount = reviews.Count;

                results.Add(new DiscoveryItemDto(
                    g.UserId,
                    g.User.FullName,
                    g.Specialties != null && g.Specialties.Any() ? string.Join(", ", g.Specialties) : (g.Bio != null && g.Bio.Length > 60 ? g.Bio.Substring(0, 57) + "..." : g.Bio) ?? "Professional Local Guide",
                    g.User.ProfileImageUrl != null && !g.User.ProfileImageUrl.StartsWith("/") && !g.User.ProfileImageUrl.StartsWith("http") 
                        ? "/" + g.User.ProfileImageUrl 
                        : g.User.ProfileImageUrl ?? $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(g.User.FullName)}&background=FFCC00&color=000&bold=true",
                    "Sri Lanka",
                    avgRating,
                    reviewCount,
                    g.User!.Role == UserRole.TravelAgency ? "agency" : "guide",
                    g.Languages.ToArray(),
                    g.User.Email,
                    g.User.Email,
                    g.WhatsAppNumber,
                    g.IsLegit,
                    g.AgencyId != null && g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted ? g.Agency?.CompanyName : null,
                    g.DailyRate,
                    null // Guides don't have a fixed "tour date"
                ));
            }
        }

        var isAgencyType = string.IsNullOrEmpty(request.Type) || string.Equals(request.Type, "agency", StringComparison.OrdinalIgnoreCase);
        if (isAgencyType)
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
                    a.User.ProfileImageUrl != null && !a.User.ProfileImageUrl.StartsWith("/") && !a.User.ProfileImageUrl.StartsWith("http") 
                        ? "/" + a.User.ProfileImageUrl 
                        : a.User.ProfileImageUrl ?? $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(a.CompanyName)}&background=000&color=fff&bold=true",
                    "Sri Lanka",
                    5.0m,
                    0,
                    "agency",
                    new string[] { "Certified", "Premium" },
                    a.Phone,
                    a.CompanyEmail,
                    a.WhatsApp,
                    false, // IsLegit
                    null,  // AgencyName
                    null,  // Price
                    null   // Date
                ))
                .ToListAsync(cancellationToken);
            
            results.AddRange(agencies);
        }

        var isTourType = string.Equals(request.Type, "tour", StringComparison.OrdinalIgnoreCase);
        if (isTourType)
        {
            var tours = await _context.Trips
                .Include(t => t.Agency)
                .Include(t => t.Images)
                .Where(t => t.IsAgencyTour)
                .Where(t => string.IsNullOrEmpty(request.Query) || 
                            t.Title.Contains(request.Query) || 
                            t.Description.Contains(request.Query))
                .ToListAsync(cancellationToken);

            foreach (var t in tours)
            {
                var reviews = await _context.Reviews
                    .Where(r => r.TargetType == "Trip" && r.TargetId == t.Id)
                    .ToListAsync(cancellationToken);
                
                var avgRating = reviews.Any() ? (decimal)Math.Round(reviews.Average(r => (double)r.Rating), 1) : 5.0m;
                var reviewCount = reviews.Count;

                var firstImage = t.Images.OrderBy(i => i.CreatedAt).FirstOrDefault()?.ImageUrl;

                results.Add(new DiscoveryItemDto(
                    t.Id,
                    t.Title,
                    t.Agency?.CompanyName ?? "Official Tour",
                    firstImage != null && !firstImage.StartsWith("/") && !firstImage.StartsWith("http") 
                        ? "/" + firstImage 
                        : firstImage ?? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80",
                    t.Location ?? "Sri Lanka",
                    avgRating,
                    reviewCount,
                    "tour",
                    new string[] { "Verified", "Agency" },
                    null,
                    null,
                    null,
                    true, // IsLegit for agency tours
                    t.Agency?.CompanyName,
                    t.Price,
                    t.Date?.ToString("MMM dd, yyyy")
                ));
            }
        }

        return results.OrderByDescending(r => r.Rating).ThenByDescending(r => r.Reviews).ToList();
    }
}
