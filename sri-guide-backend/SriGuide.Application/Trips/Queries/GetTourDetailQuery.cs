using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Trips.Queries;
using SriGuide.Domain.Entities;
using System.Linq;

namespace SriGuide.Application.Trips.Queries;

public record GetTourDetailQuery(Guid Id, Guid? CurrentUserId = null) : IRequest<TourDetailDto>;

public record TourDetailDto(
    Guid Id,
    string Title,
    string Description,
    string Location,
    string Category,
    string Duration,
    string? MapLink,
    decimal Price,
    string? MainImageUrl,
    Guid AgencyId,
    string AgencyName,
    bool IsLiked,
    int LikeCount,
    List<string> Images,
    List<TourItineraryStepDto> Itinerary,
    List<TourDayDto> DayDescriptions
);

public record TourItineraryStepDto(string? Time, string Title, string? Description, string? ImageUrl, int DayNumber, int Order);
public record TourDayDto(int DayNumber, string Description, string? ImageUrl);

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
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (tour == null) throw new Exception("Tour not found");

        var isLiked = request.CurrentUserId.HasValue && await _context.TourLikes
            .AnyAsync(tl => tl.TourId == tour.Id && tl.UserId == request.CurrentUserId.Value, cancellationToken);
        
        var likeCount = await _context.TourLikes.CountAsync(tl => tl.TourId == tour.Id, cancellationToken);

        return new TourDetailDto(
            tour.Id,
            tour.Title,
            tour.Description,
            tour.Location,
            tour.Category,
            tour.Duration,
            tour.MapLink,
            tour.Price,
            tour.MainImageUrl,
            tour.AgencyId,
            tour.Agency.CompanyName,
            isLiked,
            likeCount,
            tour.Images.Select(i => i.ImageUrl).ToList(),
            tour.Itinerary.OrderBy(s => s.DayNumber).ThenBy(s => s.Order)
                .Select(s => new TourItineraryStepDto(s.Time, s.Title, s.Description, s.ImageUrl, s.DayNumber, s.Order)).ToList(),
            tour.DayDescriptions.OrderBy(d => d.DayNumber)
                .Select(d => new TourDayDto(d.DayNumber, d.Description, d.ImageUrl)).ToList()
        );
    }
}
