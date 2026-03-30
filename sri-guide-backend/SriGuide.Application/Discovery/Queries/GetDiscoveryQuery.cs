using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Common.Models;
using SriGuide.Domain.Enums;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Discovery.Queries;

public record DiscoveryItemDto(
    Guid Id,
    string Title,
    string? Slug,
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
    string? VerificationStatus = null,
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
    string? Location = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    decimal? MinRating = null,
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
                var searchCategory = request.Category.ToLower();
                tourQuery = tourQuery.Where(t => t.Category != null && t.Category.ToLower().Contains(searchCategory));
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

            if (!string.IsNullOrEmpty(request.Location) && request.Location != "All")
            {
                var searchLocation = request.Location.ToLower();
                tourQuery = tourQuery.Where(t => t.Location != null && t.Location.ToLower().Contains(searchLocation));
            }

            if (request.MinRating.HasValue)
            {
                tourQuery = tourQuery.Where(t => _context.Reviews
                    .Where(r => r.TargetType == "Tour" && r.TargetId == t.Id)
                    .Any() && _context.Reviews
                    .Where(r => r.TargetType == "Tour" && r.TargetId == t.Id)
                    .Average(r => (double)r.Rating) >= (double)request.MinRating.Value);
            }

            // Sorting
            tourQuery = request.SortBy switch
            {
                "Price: Low to High" => tourQuery.OrderBy(t => t.Price),
                "Price: High to Low" => tourQuery.OrderByDescending(t => t.Price),
                "Most Popular" => tourQuery.OrderByDescending(t => t.Likes.Count),
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
                
                var avgRating = reviews.Any() ? (decimal)Math.Round(reviews.Average(r => (double)r.Rating), 1) : 0m;
                var reviewCount = reviews.Count;

                var firstImage = t.MainImageUrl ?? t.Images?.OrderBy(i => i.CreatedAt).FirstOrDefault()?.ImageUrl;

                results.Add(new DiscoveryItemDto(
                    t.Id,
                    t.Title,
                    t.Slug,
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
                    "Approved",
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
        // Optimized: Using projections to avoid N+1 queries for reviews and tour counts
        
        // If type is guide or null, add guides
        var isGuideType = string.IsNullOrEmpty(request.Type) || string.Equals(request.Type, "guide", StringComparison.OrdinalIgnoreCase);
        if (isGuideType)
        {
            var guidesQuery = _context.GuideProfiles
                .Include(g => g.User)
                .Include(g => g.Agency)
                .Where(g => string.IsNullOrEmpty(request.Query) || 
                            g.User.FullName.Contains(request.Query) || 
                            (g.Bio != null && g.Bio.Contains(request.Query)));

            // Basic filtering
            if (request.Languages != null && request.Languages.Any())
            {
                guidesQuery = guidesQuery.Where(g => g.Languages != null && g.Languages.Any(l => request.Languages.Contains(l)));
            }
            if (request.Specialties != null && request.Specialties.Any())
            {
                guidesQuery = guidesQuery.Where(g => g.Specialties != null && g.Specialties.Any(s => request.Specialties.Contains(s)));
            }
            if (request.Areas != null && request.Areas.Any())
            {
                guidesQuery = guidesQuery.Where(g => g.OperatingAreas != null && g.OperatingAreas.Any(a => request.Areas.Contains(a)));
            }

            // Project directly to DTO with counts/ratings
            var guidesProjected = await guidesQuery
                .Select(g => new
                {
                    Profile = g,
                    User = g.User,
                    ReviewCount = _context.Reviews.Count(r => (r.TargetType == "Guide" && r.TargetId == g.UserId) || 
                                                              (r.TargetType == "Trip" && g.Trips.Any(t => t.Id == r.TargetId))),
                    AvgRating = _context.Reviews
                                    .Where(r => (r.TargetType == "Guide" && r.TargetId == g.UserId) || 
                                                (r.TargetType == "Trip" && g.Trips.Any(t => t.Id == r.TargetId)))
                                    .Select(r => (double?)r.Rating)
                                    .Average() ?? 0.0
                })
                .ToListAsync(cancellationToken);

            // Sort in-memory to avoid LINQ translation issues for complex quality sorting
            var guidesData = guidesProjected
                .OrderByDescending(g => g.Profile.IsVerified)
                .ThenByDescending(g => g.ReviewCount)
                .ThenByDescending(g => g.Profile.CreatedAt)
                .ToList();

            foreach (var item in guidesData)
            {
                var g = item.Profile;
                var u = item.User;
                
                results.Add(new DiscoveryItemDto(
                    g.UserId,
                    u?.FullName ?? "Unknown Guide",
                    u?.Slug,
                    g.Specialties != null && g.Specialties.Any() ? string.Join(", ", g.Specialties) : (g.Bio != null && g.Bio.Length > 60 ? g.Bio.Substring(0, 57) + "..." : g.Bio) ?? "Professional Local Guide",
                    u?.ProfileImageUrl != null && !u.ProfileImageUrl.StartsWith("/") && !u.ProfileImageUrl.StartsWith("http") 
                        ? "/" + u.ProfileImageUrl 
                        : u?.ProfileImageUrl ?? $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(u?.FullName ?? "Guide")}&background=FFCC00&color=000&bold=true",
                    "Sri Lanka",
                    (decimal)Math.Round(item.AvgRating, 1),
                    item.ReviewCount,
                    "guide",
                    g.Languages?.ToArray() ?? Array.Empty<string>(),
                    u?.Email,
                    u?.Email,
                    g.WhatsAppNumber,
                    g.IsLegit,
                    g.VerificationStatus.ToString(),
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
            var agenciesQuery = _context.AgencyProfiles
                .Include(a => a.User)
                .Where(a => a.VerificationStatus == VerificationStatus.Approved)
                .Where(a => string.IsNullOrEmpty(request.Query) || 
                            a.CompanyName.Contains(request.Query) || 
                            a.User.FullName.Contains(request.Query));

            var agenciesProjected = await agenciesQuery
                .Select(a => new
                {
                    Profile = a,
                    User = a.User,
                    ToursCount = _context.Tours.Count(t => t.AgencyId == a.Id),
                    ReviewCount = _context.Reviews.Count(r => (r.TargetType == "Agency" && r.TargetId == a.UserId) ||
                                                              ((r.TargetType == "Tour" || r.TargetType == "Trip") && 
                                                               (_context.Tours.Any(t => t.AgencyId == a.Id && t.Id == r.TargetId) || 
                                                                _context.Trips.Any(t => t.AgencyId == a.Id && t.Id == r.TargetId)))),
                    AvgRating = _context.Reviews
                        .Where(r => (r.TargetType == "Agency" && r.TargetId == a.UserId) ||
                                    ((r.TargetType == "Tour" || r.TargetType == "Trip") && 
                                     (_context.Tours.Any(t => t.AgencyId == a.Id && t.Id == r.TargetId) || 
                                      _context.Trips.Any(t => t.AgencyId == a.Id && t.Id == r.TargetId))))
                        .Select(r => (double?)r.Rating)
                        .Average() ?? 0.0
                })
                .ToListAsync(cancellationToken);

            // Sort in-memory
            var agenciesData = agenciesProjected
                .OrderByDescending(a => a.AvgRating)
                .ThenByDescending(a => a.ToursCount)
                .ThenByDescending(a => a.Profile.CreatedAt)
                .ToList();

            foreach (var item in agenciesData)
            {
                var a = item.Profile;
                var u = item.User;
                
                results.Add(new DiscoveryItemDto(
                    a.Id,
                    a.CompanyName,
                    a.Slug,
                    "Official Travel Agency",
                    u?.ProfileImageUrl != null && !u.ProfileImageUrl.StartsWith("/") && !u.ProfileImageUrl.StartsWith("http") 
                        ? "/" + u.ProfileImageUrl 
                        : u?.ProfileImageUrl ?? $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(a.CompanyName)}&background=000&color=fff&bold=true",
                    "Sri Lanka",
                    (decimal)Math.Round(item.AvgRating, 1),
                    item.ReviewCount,
                    "agency",
                    new string[] { "Certified", "Premium" },
                    a.Phone,
                    a.CompanyEmail,
                    a.WhatsApp,
                    false,
                    "Approved",
                    null,
                    null,
                    null,
                    null,
                    null
                ));
            }
        }

        // Filter and Paginate the combined results
        // Use custom ordering based on type if it's mixed, otherwise maintain the order we already applied
        var sortedResults = results.ToList();
        
        // If it's mixed search, we apply a general quality sort at the end
        if (string.IsNullOrEmpty(request.Type))
        {
            sortedResults = results.OrderByDescending(r => r.Rating).ThenByDescending(r => r.Reviews).ToList();
        }

        var totalCount = sortedResults.Count;
        var paginatedResults = sortedResults.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToList();

        return new PaginatedResult<DiscoveryItemDto>(paginatedResults, totalCount, request.PageNumber, request.PageSize);
    }
}
