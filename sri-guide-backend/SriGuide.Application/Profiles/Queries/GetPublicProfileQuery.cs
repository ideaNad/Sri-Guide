using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Queries;

public record GetPublicProfileQuery(string IdOrSlug, Guid? CurrentUserId = null) : IRequest<PublicProfileDto>;

public class GetPublicProfileQueryHandler : IRequestHandler<GetPublicProfileQuery, PublicProfileDto>
{
    private readonly IApplicationDbContext _context;

    public GetPublicProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PublicProfileDto> Handle(GetPublicProfileQuery request, CancellationToken cancellationToken)
    {
        var isGuid = Guid.TryParse(request.IdOrSlug, out var userId);

        var user = await _context.Users
            .Include(u => u.GuideProfile)
            .Include(u => u.AgencyProfile)
            .FirstOrDefaultAsync(u => isGuid ? u.Id == userId : u.Slug == request.IdOrSlug, cancellationToken);

        AgencyProfile? agencyProfile = user?.AgencyProfile;
        GuideProfile? guideProfile = user?.GuideProfile;
        bool isAgency = user?.Role == UserRole.TravelAgency;

        if (user == null)
        {
            // Try to resolve as AgencyProfile directly (Search by Agency Id)
            agencyProfile = await _context.AgencyProfiles
                .Include(a => a.User)
                    .ThenInclude(u => u!.GuideProfile)
                .FirstOrDefaultAsync(a => isGuid ? a.Id == userId : a.Slug == request.IdOrSlug, cancellationToken);

            if (agencyProfile != null)
            {
                user = agencyProfile.User;
                isAgency = true;
                guideProfile = user?.GuideProfile;
            }
        }

        if (user == null)
            throw new Exception("Profile not found");

        if (!isAgency && guideProfile == null)
            throw new Exception("Guide profile not found");
        if (isAgency && agencyProfile == null)
            throw new Exception("Agency profile not found");

        var averageRating = 0.0;
        var totalReviews = 0;
        List<SriGuide.Application.Agencies.DTOs.AgencyGuideDto>? agencyGuides = null;
        var guideIdsForAgency = new List<Guid>();

        if (isAgency)
        {
            // Fetch guides for the agency
            var guidesRaw = await _context.GuideProfiles
                .Include(g => g.User)
                .Where(g => g.AgencyId == agencyProfile!.Id && g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted)
                .ToListAsync(cancellationToken);

            guideIdsForAgency = guidesRaw.Select(g => g.UserId).ToList();

            agencyGuides = guidesRaw.Select(g => new SriGuide.Application.Agencies.DTOs.AgencyGuideDto
            {
                Id = g.UserId,
                Name = g.User!.FullName,
                Role = "Guide",
                Rating = 4.8, // Fallback
                Location = g.OperatingAreas?.FirstOrDefault() ?? "Sri Lanka",
                Status = "Active",
                TripCount = 0, // Needs real count if possible
                ProfileImageUrl = g.User!.ProfileImageUrl != null && !g.User.ProfileImageUrl.StartsWith("/") && !g.User.ProfileImageUrl.StartsWith("http") 
                    ? "/" + g.User.ProfileImageUrl 
                    : g.User.ProfileImageUrl
            }).ToList();
        }

        var toursRaw = await _context.Tours
            .Include(t => t.Images)
            .Where(t => t.AgencyId == (isAgency ? agencyProfile!.Id : Guid.Empty) && t.IsActive)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

        var tripsRaw = await _context.Trips
            .Include(t => t.Images)
            .Where(t => (isAgency 
                ? (t.AgencyId == agencyProfile!.Id || (t.GuideId.HasValue && guideIdsForAgency.Contains(t.GuideId.Value))) 
                : t.GuideId == user.Id) && t.IsActive)
            .OrderByDescending(t => t.Date ?? t.CreatedAt)
            .Take(20)
            .ToListAsync(cancellationToken);

        var userLikedTripIds = request.CurrentUserId.HasValue 
            ? await _context.TripLikes
                .Where(tl => tl.UserId == request.CurrentUserId.Value)
                .Select(tl => tl.TripId)
                .ToListAsync(cancellationToken)
            : new List<Guid>();

        var userLikedTourIds = request.CurrentUserId.HasValue
            ? await _context.TourLikes
                .Where(tl => tl.UserId == request.CurrentUserId.Value)
                .Select(tl => tl.TourId)
                .ToListAsync(cancellationToken)
            : new List<Guid>();

        var tourIds = toursRaw.Select(t => t.Id).ToList();
        var tourReviews = await _context.Reviews
            .Where(r => r.TargetType == "Tour" && tourIds.Contains(r.TargetId))
            .ToListAsync(cancellationToken);

        var tripIds = tripsRaw.Select(t => t.Id).ToList();
        var tripReviews = await _context.Reviews
            .Where(r => r.TargetType == "Trip" && tripIds.Contains(r.TargetId))
            .ToListAsync(cancellationToken);

        // Fetch profile reviews (Guide or Agency)
        var profileReviews = await _context.Reviews
            .Where(r => r.TargetId == user.Id && (r.TargetType == (isAgency ? "Agency" : "Guide")))
            .ToListAsync(cancellationToken);

        // Aggregate All reviews
        var allReviews = profileReviews.Concat(tourReviews).Concat(tripReviews).ToList();
        totalReviews = allReviews.Count;
        averageRating = allReviews.Any() ? Math.Round(allReviews.Average(r => (double)r.Rating), 1) : 0.0;

        var agencyTours = toursRaw.Select(t => {
            var reviewsForTour = tourReviews.Where(r => r.TargetId == t.Id).ToList();
            var rating = reviewsForTour.Any() ? Math.Round(reviewsForTour.Average(r => (double)r.Rating), 1) : 0.0;
            var reviewCount = reviewsForTour.Count;

            return new PublicTripDto(
                t.Id,
                t.Title,
                t.Slug,
                t.MainImageUrl ?? t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl).FirstOrDefault() ?? "",
                null,
                t.Description,
                t.Location,
                rating,
                reviewCount,
                t.Images.Select(i => i.ImageUrl ?? "").ToList(),
                userLikedTourIds.Contains(t.Id)
            );
        }).ToList();

        var recentTrips = tripsRaw.Select(t => {
            var reviewsForTrip = tripReviews.Where(r => r.TargetId == t.Id).ToList();
            var rating = reviewsForTrip.Any() ? Math.Round(reviewsForTrip.Average(r => (double)r.Rating), 1) : 0.0;
            var reviewCount = reviewsForTrip.Count;

            return new PublicTripDto(
                t.Id,
                t.Title,
                t.Slug,
                t.Images.OrderBy(i => i.CreatedAt).Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.Contains("://") ? "/" + i.ImageUrl : i.ImageUrl).FirstOrDefault() ?? "",
                t.Date,
                t.Description,
                t.Location,
                rating,
                reviewCount,
                t.Images.Select(i => i.ImageUrl != null && !i.ImageUrl.StartsWith("/") && !i.ImageUrl.Contains("://") ? "/" + i.ImageUrl : i.ImageUrl).Where(url => url != null).Cast<string>().ToList(),
                userLikedTripIds.Contains(t.Id)
            );
        }).ToList();

        return new PublicProfileDto(
            user.Id,
            isAgency ? agencyProfile!.CompanyName : user.FullName,
            isAgency ? agencyProfile!.Slug : user.Slug,
            user.ProfileImageUrl != null && !user.ProfileImageUrl.StartsWith("/") && !user.ProfileImageUrl.StartsWith("http") 
                ? "/" + user.ProfileImageUrl 
                : user.ProfileImageUrl,
            isAgency ? agencyProfile!.Bio : guideProfile!.Bio,
            isAgency ? new List<string>() : (guideProfile!.Specialties ?? new List<string>()),
            isAgency ? new List<string>() : (guideProfile!.OperatingAreas ?? new List<string>()),
            isAgency ? new List<string>() : (guideProfile!.Languages ?? new List<string>()),
            isAgency ? 0 : (guideProfile!.DailyRate ?? 0),
            isAgency ? 0 : (guideProfile!.HourlyRate ?? 0),
            isAgency ? false : guideProfile!.ContactForPrice,
            isAgency ? true : guideProfile!.IsLegit,
            isAgency ? agencyProfile!.VerificationStatus.ToString() : guideProfile!.VerificationStatus.ToString(),
            averageRating,
            totalReviews,
            isAgency ? agencyProfile!.Phone : guideProfile!.PhoneNumber,
            isAgency ? agencyProfile!.WhatsApp : guideProfile!.WhatsAppNumber,
            isAgency ? agencyProfile!.YouTubeLink : guideProfile!.YouTubeLink,
            isAgency ? agencyProfile!.TikTokLink : guideProfile!.TikTokLink,
            isAgency ? agencyProfile!.FacebookLink : guideProfile!.FacebookLink,
            isAgency ? agencyProfile!.InstagramLink : guideProfile!.InstagramLink,
            isAgency ? agencyProfile!.LinkedinLink : guideProfile!.LinkedinLink,
            isAgency ? agencyProfile!.TwitterLink : guideProfile!.TwitterLink,
            agencyTours,
            recentTrips,
            agencyGuides,
            isAgency ? "Agency" : "Guide"
        );
    }
}
