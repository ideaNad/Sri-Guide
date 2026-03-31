using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Common.Models;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Discovery.Queries;

public record GetAdventuresQuery(
    string? Query,
    int PageNumber = 1,
    int PageSize = 12,
    string? Location = null,
    decimal? MinRating = null,
    string? SortBy = null
) : IRequest<PaginatedResult<DiscoveryItemDto>>;

public class GetAdventuresQueryHandler : IRequestHandler<GetAdventuresQuery, PaginatedResult<DiscoveryItemDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAdventuresQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<DiscoveryItemDto>> Handle(GetAdventuresQuery request, CancellationToken cancellationToken)
    {
        var tripQuery = _context.Trips
            .Include(t => t.Guide)
            .Include(t => t.Agency)
            .Include(t => t.Images)
            .Where(t => t.IsActive);

        if (!string.IsNullOrEmpty(request.Query))
        {
            tripQuery = tripQuery.Where(t => t.Title.Contains(request.Query) || t.Description.Contains(request.Query));
        }

        if (!string.IsNullOrEmpty(request.Location) && request.Location != "All")
        {
            var searchLocation = request.Location.ToLower();
            tripQuery = tripQuery.Where(t => t.Location != null && t.Location.ToLower().Contains(searchLocation));
        }

        if (request.MinRating.HasValue && request.MinRating.Value > 0)
        {
            // Filter by rating — calculating on the fly to avoid N+1 and complex LINQ issues
            tripQuery = tripQuery.Where(t => _context.Reviews
                .Where(r => r.TargetType == "Trip" && r.TargetId == t.Id)
                .Any() && _context.Reviews
                .Where(r => r.TargetType == "Trip" && r.TargetId == t.Id)
                .Average(r => (double)r.Rating) >= (double)request.MinRating.Value);
        }

        // Sorting
        tripQuery = request.SortBy switch
        {
            "Most Popular" => tripQuery.OrderByDescending(t => t.Likes.Count).ThenByDescending(t => t.ViewCount),
            "Latest" => tripQuery.OrderByDescending(t => t.CreatedAt),
            _ => tripQuery.OrderByDescending(t => t.CreatedAt)
        };

        var totalCount = await tripQuery.CountAsync(cancellationToken);
        var paginatedTrips = await tripQuery
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var results = new List<DiscoveryItemDto>();
        foreach (var t in paginatedTrips)
        {
            var reviews = await _context.Reviews
                .Where(r => r.TargetType == "Trip" && r.TargetId == t.Id)
                .ToListAsync(cancellationToken);
            
            var avgRating = reviews.Any() ? (decimal)Math.Round(reviews.Average(r => (double)r.Rating), 1) : 0m;
            var reviewCount = reviews.Count;

            var firstImage = t.MainImageUrl ?? t.Images?.OrderBy(i => i.CreatedAt).FirstOrDefault()?.ImageUrl;

            results.Add(new DiscoveryItemDto(
                t.Id,
                t.Title,
                t.Slug,
                t.Guide?.FullName ?? t.Agency?.CompanyName ?? "Local Explorer",
                firstImage != null && !firstImage.StartsWith("/") && !firstImage.StartsWith("http") 
                    ? "/" + firstImage 
                    : firstImage ?? "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=1200&auto=format",
                t.Location ?? "Sri Lanka",
                avgRating,
                reviewCount,
                "adventure",
                new string[] { "Community", t.Guide != null ? "Guide Shared" : "Agency Story" },
                null,
                null,
                null,
                false,
                null,
                t.Agency?.CompanyName ?? t.Guide?.FullName,
                null, // Price
                t.Date?.ToString("yyyy-MM-dd"),
                null, // Duration
                null, // MapLink
                null  // ParticipantCount
            ));
        }

        return new PaginatedResult<DiscoveryItemDto>(results, totalCount, request.PageNumber, request.PageSize);
    }
}
