using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Events.Commands.CreateEvent;

public record CreateEventCommand : IRequest<Guid>
{
    public string Title { get; init; } = string.Empty;
    public string ShortDescription { get; init; } = string.Empty;
    public string FullDescription { get; init; } = string.Empty;
    public Guid CategoryId { get; init; }
    public string EventType { get; init; } = "One-time";
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public string? StartTime { get; init; }
    public string? EndTime { get; init; }
    public string LocationName { get; init; } = string.Empty;
    public string? District { get; init; }
    public string? MapLocation { get; init; }
    public decimal Price { get; init; }
    public int MaxParticipants { get; init; }
    public string? CoverImage { get; init; }
    public List<string>? GalleryImages { get; init; }
    
    public List<CreateEventFieldValueDto> FieldValues { get; init; } = new();
    public Guid UserId { get; set; }
}

public record CreateEventFieldValueDto
{
    public Guid FieldId { get; init; }
    public string Value { get; init; } = string.Empty;
}

public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateEventCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        var organizerProfile = await _context.EventOrganizerProfiles
            .FirstOrDefaultAsync(o => o.UserId == userId, cancellationToken);

        if (organizerProfile == null)
        {
            throw new Exception("Event Organizer profile not found.");
        }

        var @event = new Event
        {
            Title = request.Title,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            CategoryId = request.CategoryId,
            OrganizerProfileId = organizerProfile.Id,
            EventType = request.EventType,
            StartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc),
            EndDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc),
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            LocationName = request.LocationName,
            District = request.District,
            MapLocation = request.MapLocation,
            Price = request.Price,
            MaxParticipants = request.MaxParticipants,
            CoverImage = request.CoverImage,
            GalleryImages = request.GalleryImages != null ? string.Join(",", request.GalleryImages) : null,
            IsPublished = true
        };

        foreach (var val in request.FieldValues)
        {
            @event.FieldValues.Add(new EventFieldValue
            {
                FieldId = val.FieldId,
                Value = val.Value
            });
        }

        _context.Events.Add(@event);
        await _context.SaveChangesAsync(cancellationToken);

        return @event.Id;
    }
}
