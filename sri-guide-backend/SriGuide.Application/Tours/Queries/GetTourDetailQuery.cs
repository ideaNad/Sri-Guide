using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Tours.Queries;

public record TourItineraryStepDto(
    string Time,
    string Title,
    string Description,
    string? ImageUrl,
    int DayNumber,
    int Order
);

public record TourDayDto(
    int DayNumber,
    string Description,
    string? ImageUrl = null
);

public record TourDetailDto(
    Guid Id,
    string Title,
    string Description,
    string Location,
    string? Category,
    decimal Price,
    string? Duration,
    string? MapLink,
    string? MainImageUrl,
    List<string> Images,
    Guid AgencyId,
    string AgencyName,
    string? AgencyImageUrl,
    int LikeCount,
    bool IsLikedByCurrentUser,
    List<TourItineraryStepDto> Itinerary,
    List<TourDayDto> DayDescriptions,
    bool IsActive = true
);

public record GetTourDetailQuery(Guid TourId, Guid? CurrentUserId) : IRequest<TourDetailDto>;

public class GetTourDetailQueryHandler : IRequestHandler<GetTourDetailQuery, TourDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetTourDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TourDetailDto> Handle(GetTourDetailQuery request, CancellationToken cancellationToken)
    {
        var tour = await _context.Tours
            .Include(t => t.Agency)
            .Include(t => t.Images)
            .Include(t => t.Itinerary)
            .Include(t => t.DayDescriptions)
            .FirstOrDefaultAsync(t => t.Id == request.TourId, cancellationToken);

        if (tour == null) throw new Exception("Tour not found");

        var likeCount = await _context.TourLikes.CountAsync(tl => tl.TourId == tour.Id, cancellationToken);
        var isLiked = request.CurrentUserId.HasValue && await _context.TourLikes.AnyAsync(tl => tl.TourId == tour.Id && tl.UserId == request.CurrentUserId, cancellationToken);

        return new TourDetailDto(
            tour.Id,
            tour.Title,
            tour.Description,
            tour.Location,
            tour.Category,
            tour.Price,
            tour.Duration,
            tour.MapLink,
            tour.MainImageUrl,
            tour.Images.Select(i => i.ImageUrl).ToList(),
            tour.AgencyId,
            tour.Agency?.CompanyName ?? "Sri Lankan Agency",
            tour.Agency?.User?.ProfileImageUrl, // Simplified for now
            likeCount,
            isLiked,
            tour.Itinerary.OrderBy(s => s.DayNumber).ThenBy(s => s.Order).Select(s => new TourItineraryStepDto(
                s.Time, s.Title, s.Description, s.ImageUrl, s.DayNumber, s.Order
            )).ToList(),
            tour.DayDescriptions.OrderBy(d => d.DayNumber).Select(d => new TourDayDto(
                d.DayNumber, d.Description, d.ImageUrl
            )).ToList(),
            tour.IsActive
        );
    }
}
