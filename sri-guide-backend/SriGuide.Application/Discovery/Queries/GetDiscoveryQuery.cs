using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Common.Models;
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
    string? Date = null,
    string? Duration = null,
    string? MapLink = null
);

public record GetDiscoveryQuery(
    string? Query, 
    string? Type,
    List<string>? Languages = null,
    List<string>? Specialties = null,
    List<string>? Areas = null,
    int PageNumber = 1,
    int PageSize = 10,
    string? Category = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? Duration = null,
    string? SortBy = null
) : IRequest<PaginatedResult<DiscoveryItemDto>>;

public class GetDiscoveryQueryHandler : IRequestHandler<GetDiscoveryQuery, PaginatedResult<DiscoveryItemDto>>
{
    private readonly IApplicationDbContext _context;

    public GetDiscoveryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<DiscoveryItemDto>> Handle(GetDiscoveryQuery request, CancellationToken cancellationToken)
    {
        var results = new List<DiscoveryItemDto>();

        // If type is tour, we do full server-side filtering and pagination directly on the Tour table
        if (string.Equals(request.Type, "tour", StringComparison.OrdinalIgnoreCase))
        {
            var tourQuery = _context.Tours
                .Include(t => t.Agency)
                .Include(t => t.Images)
                .Where(t => t.IsActive);

            if (!string.IsNullOrEmpty(request.Query))
            {
                tourQuery = tourQuery.Where(t => t.Title.Contains(request.Query) || t.Description.Contains(request.Query));
            }

            if (!string.IsNullOrEmpty(request.Category) && request.Category != "All")
            {
                tourQuery = tourQuery.Where(t => t.Category != null && t.Category.Contains(request.Category));
            }

            if (request.MinPrice.HasValue)
            {
                tourQuery = tourQuery.Where(t => t.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                tourQuery = tourQuery.Where(t => t.Price <= request.MaxPrice.Value);
            }

            if (!string.IsNullOrEmpty(request.Duration))
            {
                if (request.Duration == "1-3 Hours")
                {
                    tourQuery = tourQuery.Where(t => t.Duration != null && (t.Duration.Contains("Hour") || t.Duration.Contains("1-3")));
                }
                else if (request.Duration == "Full Day")
                {
                    tourQuery = tourQuery.Where(t => t.Duration != null && (t.Duration.Contains("Full Day") || t.Duration.Contains("1 Day")));
                }
                else if (request.Duration == "Multi-day")
                {
                    tourQuery = tourQuery.Where(t => t.Duration != null && (t.Duration.Contains("Multi-day") || t.Duration.Contains("Days") || t.Duration.Contains("2 Day") || t.Duration.Contains("3 Day")));
                }
                else
                {
                    tourQuery = tourQuery.Where(t => t.Duration != null && t.Duration.Contains(request.Duration));
                }
            }

            // Sorting
            tourQuery = request.SortBy switch
            {
                "Price: Low to High" => tourQuery.OrderBy(t => t.Price),
                "Price: High to Low" => tourQuery.OrderByDescending(t => t.Price),
                _ => tourQuery.OrderByDescending(t => t.CreatedAt)
            };

            var totalToursCount = await tourQuery.CountAsync(cancellationToken);
            var paginatedTours = await tourQuery
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            foreach (var t in paginatedTours)
            {
                var reviews = await _context.Reviews
                    .Where(r => r.TargetType == "Tour" && r.TargetId == t.Id)
                    .ToListAsync(cancellationToken);
                
                var avgRating = reviews.Any() ? (decimal)Math.Round(reviews.Average(r => (double)r.Rating), 1) : 5.0m;
                var reviewCount = reviews.Count;

                var firstImage = t.MainImageUrl ?? t.Images.OrderBy(i => i.CreatedAt).FirstOrDefault()?.ImageUrl;

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
                    true,
                    t.Agency?.CompanyName,
                    t.Price,
                    null,
                    t.Duration,
                    t.MapLink
                ));
            }

            return new PaginatedResult<DiscoveryItemDto>(results, totalToursCount, request.PageNumber, request.PageSize);
        }

        // For other types (Guide, Agency, or Mixed), we maintain the current in-memory processing for now but with pagination
        // This can be further optimized if needed.
        
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
                    null,
                    null,
                    null
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
                    false,
                    null,
                    null,
                    null,
                    null,
                    null
                ))
                .ToListAsync(cancellationToken);
            
            results.AddRange(agencies);
        }

        // Filter and Paginate the combined results
        var sortedResults = results.OrderByDescending(r => r.Rating).ThenByDescending(r => r.Reviews).ToList();
        var totalCount = sortedResults.Count;
        var paginatedResults = sortedResults.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToList();

        return new PaginatedResult<DiscoveryItemDto>(paginatedResults, totalCount, request.PageNumber, request.PageSize);
    }
}
