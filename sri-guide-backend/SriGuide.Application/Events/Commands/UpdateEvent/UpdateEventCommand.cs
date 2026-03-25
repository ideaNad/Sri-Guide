using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Events.Commands.UpdateEvent;

public record UpdateEventCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
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
    
    public List<UpdateEventFieldValueDto> FieldValues { get; init; } = new();
    public Guid UserId { get; set; }
}

public record UpdateEventFieldValueDto
{
    public Guid FieldId { get; init; }
    public string Value { get; init; } = string.Empty;
}

public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateEventCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var @event = await _context.Events
            .Include(e => e.FieldValues)
            .Include(e => e.OrganizerProfile)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (@event == null)
        {
            throw new Exception("Event not found.");
        }

        if (@event.OrganizerProfile.UserId != request.UserId)
        {
            throw new Exception("You are not authorized to update this event.");
        }

        @event.Title = request.Title;
        @event.ShortDescription = request.ShortDescription;
        @event.FullDescription = request.FullDescription;
        @event.CategoryId = request.CategoryId;
        @event.EventType = request.EventType;
        @event.StartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc);
        @event.EndDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc);
        @event.StartTime = request.StartTime;
        @event.EndTime = request.EndTime;
        @event.LocationName = request.LocationName;
        @event.District = request.District;
        @event.MapLocation = request.MapLocation;
        @event.Price = request.Price;
        @event.MaxParticipants = request.MaxParticipants;
        @event.CoverImage = request.CoverImage;
        @event.GalleryImages = request.GalleryImages != null ? string.Join(",", request.GalleryImages) : null;
        @event.UpdatedAt = DateTime.UtcNow;

        // Update Field Values (Bulk Update pattern)
        await _context.EventFieldValues
            .Where(v => v.EventId == request.Id)
            .ExecuteDeleteAsync(cancellationToken);

        if (request.FieldValues != null)
        {
            foreach (var rv in request.FieldValues)
            {
                @event.FieldValues.Add(new EventFieldValue
                {
                    FieldId = rv.FieldId,
                    Value = rv.Value ?? string.Empty
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
