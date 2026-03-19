using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Profiles.Queries;

public record GetPublicProfileQuery(Guid UserId) : IRequest<PublicProfileDto>;

public class GetPublicProfileQueryHandler : IRequestHandler<GetPublicProfileQuery, PublicProfileDto>
{
    private readonly IApplicationDbContext _context;

    public GetPublicProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PublicProfileDto> Handle(GetPublicProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.GuideProfile)
            .ThenInclude(p => p!.Trips)
            .ThenInclude(t => t.Images)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null || user.GuideProfile == null)
            throw new Exception("Guide not found");

        var tripIds = user.GuideProfile.Trips.Select(t => t.Id).ToList();
        var tripReviews = await _context.Reviews
            .Where(r => r.TargetType == "Trip" && tripIds.Contains(r.TargetId))
            .ToListAsync(cancellationToken);

        var trips = user.GuideProfile.Trips
            .OrderByDescending(t => t.Date ?? t.CreatedAt)
            .Take(5)
            .Select(t => {
                var reviews = tripReviews.Where(r => r.TargetId == t.Id).ToList();
                var rating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
                var reviewCount = reviews.Count;

                return new PublicTripDto(
                    t.Id,
                    t.Title,
                    t.Images.FirstOrDefault()?.ImageUrl ?? "",
                    t.Date,
                    t.Description,
                    t.Location,
                    rating,
                    reviewCount,
                    t.Images.Select(i => i.ImageUrl).ToList()
                );
            })
            .ToList();

        return new PublicProfileDto(
            user.Id,
            user.FullName,
            user.ProfileImageUrl,
            user.GuideProfile.Bio,
            user.GuideProfile.Specialty,
            user.GuideProfile.Languages,
            user.GuideProfile.DailyRate ?? 0,
            user.GuideProfile.IsLegit,
            user.GuideProfile.VerificationStatus.ToString(),
            trips
        );
    }
}
