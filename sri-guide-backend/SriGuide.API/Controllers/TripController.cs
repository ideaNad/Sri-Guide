using SriGuide.Application.Profiles.Commands;
using SriGuide.Application.Profiles.Queries;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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

    // Temporary basic actions until commands/queries are fully implemented
    [HttpGet("guide/{guideId}")]
    public async Task<ActionResult<List<DashboardTripDto>>> GetGuideTrips(Guid guideId)
    {
        var result = await _mediator.Send(new GetGuideTripsQuery(guideId));
        return Ok(result);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Guide")]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(command with { GuideId = Guid.Parse(userId) });
        return Ok(result);
    }

    [HttpPost("{tripId}/upload-photo")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Guide")]
    public async Task<IActionResult> UploadTripImage(Guid tripId, IFormFile file)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        var result = await _mediator.Send(new UploadTripImageCommand(tripId, Guid.Parse(userId), file));
        return Ok(new { ImageUrl = result });
    }

    [HttpDelete("{tripId}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Guide")]
    public async Task<IActionResult> DeleteTrip(Guid tripId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _mediator.Send(new DeleteTripCommand(tripId, Guid.Parse(userId)));
        if (!success) return NotFound("Trip not found or you don't have permission to delete it.");

        return Ok();
    }
}
