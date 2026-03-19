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

        var tripsRaw = await _context.Trips
            .Include(t => t.Images)
            .Where(t => t.GuideId == user.Id)
            .OrderByDescending(t => t.Date ?? t.CreatedAt)
            .Take(20)
            .ToListAsync(cancellationToken);

        var tripIds = tripsRaw.Select(t => t.Id).ToList();
        var tripReviews = await _context.Reviews
            .Where(r => r.TargetType == "Trip" && tripIds.Contains(r.TargetId))
            .ToListAsync(cancellationToken);

        var trips = tripsRaw.Select(t => {
            var reviews = tripReviews.Where(r => r.TargetId == t.Id).ToList();
            var rating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
            var reviewCount = reviews.Count;

            return new PublicTripDto(
                t.Id,
                t.Title,
                t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.Contains("://") ? "/" + i.ImageUrl : i.ImageUrl).FirstOrDefault() ?? "",
                t.Date,
                t.Description,
                t.Location,
                rating,
                reviewCount,
                t.Images.Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.Contains("://") ? "/" + i.ImageUrl : i.ImageUrl).Where(url => url != null).Cast<string>().ToList()
            );
        }).ToList();

        var guideAverageRating = tripReviews.Any() ? tripReviews.Average(r => r.Rating) : 0;
        var guideTotalReviews = tripReviews.Count;

        return new PublicProfileDto(
            user.Id,
            user.FullName,
            user.ProfileImageUrl != null && !user.ProfileImageUrl.StartsWith("/") && !user.ProfileImageUrl.StartsWith("http") 
                ? "/" + user.ProfileImageUrl 
                : user.ProfileImageUrl,
            user.GuideProfile.Bio,
            user.GuideProfile.Specialty,
            user.GuideProfile.Languages,
            user.GuideProfile.DailyRate ?? 0,
            user.GuideProfile.ContactForPrice,
            user.GuideProfile.IsLegit,
            user.GuideProfile.VerificationStatus.ToString(),
            guideAverageRating,
            guideTotalReviews,
            user.GuideProfile.PhoneNumber,
            user.GuideProfile.WhatsAppNumber,
            user.GuideProfile.YouTubeLink,
            user.GuideProfile.TikTokLink,
            user.GuideProfile.FacebookLink,
            user.GuideProfile.InstagramLink,
            trips
        );
    }
}
