using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Events.Commands.CreateEvent;
using SriGuide.Application.Events.Queries.GetEvents;
using SriGuide.Application.Events.DTOs;
using System.Security.Claims;
using SriGuide.Application.Events.Queries.GetOrganizerDashboard;
using SriGuide.Application.Events.Commands.UpdateEvent;
using SriGuide.Application.Events.Commands.CancelEvent;
using SriGuide.Application.Events.Commands.DeleteEvent;
using SriGuide.Application.Events.Queries.GetEventById;
using SriGuide.Application.Events.Commands.ToggleEventLike;
using SriGuide.Application.Events.Commands.CreateEventReview;
using SriGuide.Application.Events.Queries.GetEventReviews;
using SriGuide.Application.Events.Queries.GetOrganizerReviews;
using SriGuide.Application.Events.Queries.GetLikedEvents;

namespace SriGuide.API.Controllers;

[Authorize]
[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IApplicationDbContext _context;

    public EventsController(IMediator mediator, IApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<EventDto>>> GetEvents([FromQuery] GetEventsQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return await _mediator.Send(query with { UserId = userId != null ? Guid.Parse(userId) : null });
    }

    [HttpPost]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult<Guid>> CreateEvent([FromBody] CreateEventCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return await _mediator.Send(command with { UserId = Guid.Parse(userId) });
    }
    [HttpGet("my-events")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult<List<EventDetailsDto>>> GetMyEvents()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var organizer = await _context.EventOrganizerProfiles
            .FirstOrDefaultAsync(o => o.UserId == Guid.Parse(userId));
            
        if (organizer == null) return NotFound("Organizer profile not found");

        var events = await _context.Events
            .Where(e => e.OrganizerProfileId == organizer.Id)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EventDetailsDto
            {
                Id = e.Id,
                Title = e.Title,
                ShortDescription = e.ShortDescription,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Price = (double)e.Price,
                LocationName = e.LocationName,
                CoverImage = e.CoverImage,
                IsPublished = e.IsPublished,
                IsCancelled = e.IsCancelled,
                CategoryName = e.Category.Name
            })
            .ToListAsync();

        return Ok(events);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<EventDto>> GetEvent(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = new GetEventByIdQuery(id, userId != null ? Guid.Parse(userId) : null);
        
        var @event = await _mediator.Send(query);
        if (@event == null) return NotFound();
        return Ok(@event);
    }

    [HttpPost("{id}/like")]
    [Authorize]
    public async Task<ActionResult<bool>> ToggleLike(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return Ok(await _mediator.Send(new ToggleEventLikeCommand(id, Guid.Parse(userId))));
    }

    [HttpPost("{id}/reviews")]
    [Authorize]
    public async Task<ActionResult> CreateReview(Guid id, [FromBody] CreateEventReviewCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        await _mediator.Send(command with { EventId = id, UserId = Guid.Parse(userId) });
        return Ok();
    }
    
    [HttpGet("{id}/reviews")]
    [AllowAnonymous]
    public async Task<ActionResult<List<EventReviewDto>>> GetReviews(Guid id)
    {
        // I will implement GetEventReviewsQuery next
        return Ok(await _mediator.Send(new GetEventReviewsQuery(id)));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventCommand command)
    {
        if (id != command.Id) return BadRequest("ID mismatch");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        await _mediator.Send(command with { UserId = Guid.Parse(userId) });
        return NoContent();
    }

    [HttpPatch("{id}/cancel")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult> CancelEvent(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        await _mediator.Send(new CancelEventCommand(id, Guid.Parse(userId)));
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult> DeleteEvent(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        await _mediator.Send(new DeleteEventCommand(id, Guid.Parse(userId)));
        return NoContent();
    }

    [HttpGet("dashboard")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult<OrganizerDashboardDto>> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return await _mediator.Send(new GetOrganizerDashboardQuery(Guid.Parse(userId)));
    }

    [HttpGet("my-reviews")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult<List<EventReviewDto>>> GetMyReviews()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return await _mediator.Send(new GetOrganizerReviewsQuery(Guid.Parse(userId)));
    }

    [HttpGet("liked")]
    [Authorize]
    public async Task<ActionResult<List<EventDto>>> GetLikedEvents()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return await _mediator.Send(new GetLikedEventsQuery(Guid.Parse(userId)));
    }
}
