using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.DTOs;

namespace SriGuide.Application.Events.Queries.GetEventById;

public record GetEventByIdQuery(Guid Id, Guid? CurrentUserId = null) : IRequest<EventDto?>;

public class GetEventByIdQueryHandler : IRequestHandler<GetEventByIdQuery, EventDto?>
{
    private readonly IApplicationDbContext _context;

    public GetEventByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EventDto?> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
    {
        var @event = await _context.Events
            .Include(e => e.Category)
            .Include(e => e.OrganizerProfile)
            .Include(e => e.FieldValues)
                .ThenInclude(v => v.Field)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (@event == null) return null;

        var likeCount = await _context.EventLikes.CountAsync(l => l.EventId == @event.Id, cancellationToken);
        var reviews = await _context.EventReviews.Where(r => r.EventId == @event.Id).ToListAsync(cancellationToken);
        var avgRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
        var reviewCount = reviews.Count;
        var isLiked = request.CurrentUserId.HasValue && await _context.EventLikes.AnyAsync(l => l.EventId == @event.Id && l.UserId == request.CurrentUserId, cancellationToken);

        return new EventDto
        {
            Id = @event.Id,
            Title = @event.Title,
            ShortDescription = @event.ShortDescription,
            FullDescription = @event.FullDescription,
            CategoryId = @event.CategoryId,
            CategoryName = @event.Category.Name,
            OrganizerProfileId = @event.OrganizerProfileId,
            OrganizationName = @event.OrganizerProfile.OrganizationName,
            EventType = @event.EventType,
            StartDate = @event.StartDate,
            EndDate = @event.EndDate,
            StartTime = @event.StartTime,
            EndTime = @event.EndTime,
            LocationName = @event.LocationName,
            District = @event.District,
            MapLocation = @event.MapLocation,
            Price = @event.Price,
            Currency = @event.Currency,
            MaxParticipants = @event.MaxParticipants,
            CoverImage = @event.CoverImage,
            GalleryImages = !string.IsNullOrEmpty(@event.GalleryImages) 
                ? @event.GalleryImages.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() 
                : new List<string>(),
            IsPublished = @event.IsPublished,
            IsCancelled = @event.IsCancelled,
            LikeCount = likeCount,
            AverageRating = avgRating,
            ReviewCount = reviewCount,
            IsLiked = isLiked,
            FieldValues = @event.FieldValues.Select(v => new EventFieldValueDto
            {
                FieldId = v.FieldId,
                FieldLabel = v.Field.FieldLabel,
                FieldName = v.Field.FieldName,
                FieldType = v.Field.FieldType,
                Value = v.Value
            }).ToList()
        };
    }
}
