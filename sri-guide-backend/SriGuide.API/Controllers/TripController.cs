using SriGuide.Application.Profiles.Commands;
using SriGuide.Application.Profiles.Queries;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using SriGuide.Application.Trips.Commands;
using SriGuide.Application.Trips.Queries;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripController : ControllerBase
{
    private readonly IMediator _mediator;

    public TripController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TripDetailDto>> GetTripById(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? currentUserId = userId != null ? Guid.Parse(userId) : null;

        var result = await _mediator.Send(new GetTripDetailQuery(id, currentUserId));
        return Ok(result);
    }

    // Temporary basic actions until commands/queries are fully implemented
    [HttpGet("guide/{guideId}")]
    public async Task<ActionResult<List<DashboardTripDto>>> GetGuideTrips(Guid guideId)
    {
        var result = await _mediator.Send(new GetGuideTripsQuery(guideId));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Guide,TravelAgency")]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var agencyId = User.FindFirstValue("AgencyProfileId");
        
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(command with { 
            GuideId = User.IsInRole("Guide") ? Guid.Parse(userId) : command.GuideId,
            AgencyId = !string.IsNullOrEmpty(agencyId) ? Guid.Parse(agencyId) : null
        });
        return Ok(result);
    }

    [HttpPost("{tripId}/upload-photo")]
    [Authorize(Roles = "Guide,TravelAgency")]
    public async Task<IActionResult> UploadTripImage(Guid tripId, IFormFile file)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var agencyId = User.FindFirstValue("AgencyProfileId");
        
        if (userId == null) return Unauthorized();
        
        var result = await _mediator.Send(new UploadTripImageCommand(
            tripId, 
            User.IsInRole("Guide") ? Guid.Parse(userId) : null, 
            !string.IsNullOrEmpty(agencyId) ? Guid.Parse(agencyId) : null, 
            file));
            
        return Ok(new { ImageUrl = result });
    }

    [HttpDelete("{tripId}")]
    [Authorize(Roles = "Guide,TravelAgency")]
    public async Task<IActionResult> DeleteTrip(Guid tripId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var agencyId = User.FindFirstValue("AgencyProfileId");
        
        if (userId == null) return Unauthorized();

        var success = await _mediator.Send(new DeleteTripCommand(
            tripId, 
            User.IsInRole("Guide") ? Guid.Parse(userId) : null,
            !string.IsNullOrEmpty(agencyId) ? Guid.Parse(agencyId) : null));
            
        if (!success) return NotFound("Trip not found or you don't have permission to delete it.");

        return Ok();
    }

    [HttpPut("{tripId}")]
    [Authorize(Roles = "Guide,TravelAgency")]
    public async Task<IActionResult> UpdateTrip(Guid tripId, [FromBody] UpdateTripCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var agencyId = User.FindFirstValue("AgencyProfileId");

        if (userId == null) return Unauthorized();
        if (tripId != command.TripId) return BadRequest("Trip ID mismatch");

        var success = await _mediator.Send(command with { 
            GuideId = User.IsInRole("Guide") ? Guid.Parse(userId) : null,
            AgencyId = !string.IsNullOrEmpty(agencyId) ? Guid.Parse(agencyId) : null
        });
        
        if (!success) return NotFound("Trip not found or you don't have permission to update it.");

        return Ok();
    }

    [HttpPost("{tripId}/toggle-like")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(Guid tripId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(new ToggleTripLikeCommand(tripId, Guid.Parse(userId)));
        return Ok(new { liked = result });
    }

    [HttpGet("liked")]
    [Authorize]
    public async Task<ActionResult<List<DashboardTripDto>>> GetLikedTrips()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(new GetLikedTripsQuery(Guid.Parse(userId)));
        return Ok(result);
    }
}
