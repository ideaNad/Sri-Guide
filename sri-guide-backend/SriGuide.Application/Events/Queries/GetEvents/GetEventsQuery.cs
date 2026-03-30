using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.DTOs;

namespace SriGuide.Application.Events.Queries.GetEvents;

public record GetEventsQuery : IRequest<List<EventDto>>
{
    public Guid? CategoryId { get; init; }
    public string? District { get; init; }
    public string? EventType { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public bool? IsFeatured { get; init; }
    public Guid? UserId { get; init; }
}

public class GetEventsQueryHandler : IRequestHandler<GetEventsQuery, List<EventDto>>
{
    private readonly IApplicationDbContext _context;

    public GetEventsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventDto>> Handle(GetEventsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Events
            .Include(e => e.Category)
            .Include(e => e.OrganizerProfile)
            .Include(e => e.FieldValues)
                .ThenInclude(v => v.Field)
            .Where(e => e.IsPublished && !e.IsCancelled)
            .AsQueryable();

        if (request.CategoryId.HasValue)
            query = query.Where(e => e.CategoryId == request.CategoryId.Value);

        if (!string.IsNullOrEmpty(request.District))
            query = query.Where(e => e.District == request.District);

        if (!string.IsNullOrEmpty(request.EventType))
            query = query.Where(e => e.EventType == request.EventType);

        if (request.MinPrice.HasValue)
            query = query.Where(e => e.Price >= request.MinPrice.Value);

        if (request.MaxPrice.HasValue)
            query = query.Where(e => e.Price <= request.MaxPrice.Value);

        if (request.StartDate.HasValue)
            query = query.Where(e => e.StartDate >= request.StartDate.Value);

        if (request.EndDate.HasValue)
            query = query.Where(e => e.EndDate <= request.EndDate.Value);

        return await query
            .OrderByDescending(e => _context.EventReviews.Where(r => r.EventId == e.Id).Average(r => (double?)r.Rating) ?? 0)
            .ThenByDescending(e => e.CreatedAt)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                ShortDescription = e.ShortDescription,
                FullDescription = e.FullDescription,
                CategoryId = e.CategoryId,
                CategoryName = e.Category.Name,
                OrganizerProfileId = e.OrganizerProfileId,
                OrganizationName = e.OrganizerProfile.OrganizationName,
                EventType = e.EventType,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                LocationName = e.LocationName,
                District = e.District,
                MapLocation = e.MapLocation,
                Price = e.Price,
                Currency = e.Currency,
                MaxParticipants = e.MaxParticipants,
                CoverImage = e.CoverImage,
                GalleryImages = !string.IsNullOrEmpty(e.GalleryImages) 
                    ? e.GalleryImages.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() 
                    : new List<string>(),
                IsPublished = e.IsPublished,
                IsCancelled = e.IsCancelled,
                LikeCount = _context.EventLikes.Count(l => l.EventId == e.Id),
                ReviewCount = _context.EventReviews.Count(r => r.EventId == e.Id),
                AverageRating = _context.EventReviews.Where(r => r.EventId == e.Id).Any() 
                    ? _context.EventReviews.Where(r => r.EventId == e.Id).Average(r => (double)r.Rating) 
                    : 0,
                IsLiked = request.UserId.HasValue && _context.EventLikes.Any(l => l.EventId == e.Id && l.UserId == request.UserId.Value),
                FieldValues = e.FieldValues.Select(v => new EventFieldValueDto
                {
                    FieldId = v.FieldId,
                    FieldLabel = v.Field.FieldLabel,
                    FieldName = v.Field.FieldName,
                    FieldType = v.Field.FieldType,
                    Value = v.Value
                }).ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
