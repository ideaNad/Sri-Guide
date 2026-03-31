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
        // 1. Load with AsNoTracking to get a clean slate
        var @event = await _context.Events
            .Include(e => e.FieldValues)
            .Include(e => e.OrganizerProfile)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (@event == null)
        {
            throw new Exception("Event not found.");
        }

        if (@event.OrganizerProfile.UserId != request.UserId)
        {
            throw new Exception("You are not authorized to update this event.");
        }

        // 2. Synchronization Logic (Disconnected)
        bool isModified = false;
        if (@event.Title != request.Title) { @event.Title = request.Title; isModified = true; }
        if (@event.ShortDescription != request.ShortDescription) { @event.ShortDescription = request.ShortDescription; isModified = true; }
        if (@event.FullDescription != request.FullDescription) { @event.FullDescription = request.FullDescription; isModified = true; }
        if (@event.CategoryId != request.CategoryId) { @event.CategoryId = request.CategoryId; isModified = true; }
        if (@event.EventType != request.EventType) { @event.EventType = request.EventType; isModified = true; }
        
        var newStartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc);
        if (@event.StartDate != newStartDate) { @event.StartDate = newStartDate; isModified = true; }
        
        var newEndDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc);
        if (@event.EndDate != newEndDate) { @event.EndDate = newEndDate; isModified = true; }
        
        if (@event.StartTime != request.StartTime) { @event.StartTime = request.StartTime; isModified = true; }
        if (@event.EndTime != request.EndTime) { @event.EndTime = request.EndTime; isModified = true; }
        if (@event.LocationName != request.LocationName) { @event.LocationName = request.LocationName; isModified = true; }
        if (@event.District != request.District) { @event.District = request.District; isModified = true; }
        if (@event.MapLocation != request.MapLocation) { @event.MapLocation = request.MapLocation; isModified = true; }
        if (@event.Price != request.Price) { @event.Price = request.Price; isModified = true; }
        if (@event.MaxParticipants != request.MaxParticipants) { @event.MaxParticipants = request.MaxParticipants; isModified = true; }
        if (@event.CoverImage != request.CoverImage) { @event.CoverImage = request.CoverImage; isModified = true; }
        
        var newGalleryImages = request.GalleryImages != null ? string.Join(",", request.GalleryImages) : null;
        if (@event.GalleryImages != newGalleryImages) { @event.GalleryImages = newGalleryImages; isModified = true; }

        if (isModified) @event.UpdatedAt = DateTime.UtcNow;

        // Sync FieldValues
        var incomingFieldValues = (request.FieldValues ?? new List<UpdateEventFieldValueDto>())
            .GroupBy(v => v.FieldId)
            .Select(g => g.First())
            .ToList();

        // Get valid fields for this category
        var validFieldIds = await _context.EventCategoryFields
            .Where(f => f.CategoryId == request.CategoryId)
            .Select(f => f.Id)
            .ToListAsync(cancellationToken);

        incomingFieldValues = incomingFieldValues.Where(v => validFieldIds.Contains(v.FieldId)).ToList();

        var existingFieldValues = @event.FieldValues.ToList();
        var valuesToUpdate = new List<EventFieldValue>();
        var valuesToAdd = new List<EventFieldValue>();
        var valuesToRemove = new List<EventFieldValue>();

        // Identify ones to remove
        var incomingFieldIds = incomingFieldValues.Select(v => v.FieldId).ToList();
        valuesToRemove.AddRange(existingFieldValues.Where(v => !incomingFieldIds.Contains(v.FieldId) || !validFieldIds.Contains(v.FieldId)));

        foreach (var incoming in incomingFieldValues)
        {
            var existing = existingFieldValues.FirstOrDefault(v => v.FieldId == incoming.FieldId);
            if (existing != null)
            {
                if (existing.Value != (incoming.Value ?? string.Empty))
                {
                    existing.Value = incoming.Value ?? string.Empty;
                    existing.UpdatedAt = DateTime.UtcNow;
                    valuesToUpdate.Add(existing);
                }
            }
            else
            {
                valuesToAdd.Add(new EventFieldValue
                {
                    EventId = @event.Id,
                    FieldId = incoming.FieldId,
                    Value = incoming.Value ?? string.Empty
                });
            }
        }

        // 3. Manual Attachment
        _context.Entry(@event).State = isModified ? EntityState.Modified : EntityState.Unchanged;

        foreach (var val in valuesToUpdate)
        {
            _context.Entry(val).State = EntityState.Modified;
        }

        foreach (var val in valuesToAdd)
        {
            _context.Entry(val).State = EntityState.Added;
        }

        foreach (var val in valuesToRemove)
        {
            _context.Entry(val).State = EntityState.Deleted;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
