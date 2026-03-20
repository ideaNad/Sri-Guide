using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Application.Agencies.Queries;
using SriGuide.Application.Agencies.Commands;
using SriGuide.Application.Common.Models;
using SriGuide.Application.Trips.Commands;
using SriGuide.Domain.Enums;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[Authorize(Roles = "TravelAgency")]
[ApiController]
[Route("api/[controller]")]
public class AgencyController : ControllerBase
{
    private readonly IMediator _mediator;

    public AgencyController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AgencyDashboardDto>> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyDashboardQuery(Guid.Parse(userId)));
    }

    [HttpGet("guides")]
    public async Task<ActionResult<PaginatedResult<AgencyGuideDto>>> GetGuides([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 6)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyGuidesQuery(Guid.Parse(userId), pageNumber, pageSize));
    }

    [HttpGet("guides/available")]
    public async Task<ActionResult<List<AvailableGuideDto>>> GetAvailableGuides([FromQuery] string? searchTerm)
    {
        return await _mediator.Send(new GetAvailableGuidesQuery(searchTerm));
    }

    [HttpGet("trips")]
    public async Task<ActionResult<List<AgencyTripDto>>> GetTrips()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyTripsQuery(Guid.Parse(userId)));
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<List<AgencyBookingDto>>> GetBookings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyBookingsQuery(Guid.Parse(userId)));
    }

    [HttpPost("guides/add")]
    public async Task<IActionResult> AddGuide([FromBody] AddGuideToAgencyCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var success = await _mediator.Send(command with { AgencyId = Guid.Parse(userId) });
        return success ? Ok() : BadRequest("Guide not found or already in agency");
    }

    [HttpPost("guides/remove")]
    public async Task<IActionResult> RemoveGuide([FromBody] RemoveGuideFromAgencyCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var success = await _mediator.Send(command with { AgencyId = Guid.Parse(userId) });
        return success ? Ok() : BadRequest("Guide not found or not part of this agency");
    }

    [HttpPost("tours")]
    public async Task<ActionResult<Guid>> CreateTour([FromBody] CreateTourCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var result = await _mediator.Send(command with { AgencyId = Guid.Parse(userId) });
        return Ok(result);
    }

    [HttpPut("tours/{id}")]
    public async Task<IActionResult> UpdateTour(Guid id, [FromBody] UpdateTourCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (id != command.TripId) return BadRequest("Tour ID mismatch");
        
        var success = await _mediator.Send(command with { AgencyId = Guid.Parse(userId) });
        return success ? Ok() : NotFound("Tour not found or you don't have permission to update it.");
    }

    [HttpDelete("tours/{id}")]
    public async Task<IActionResult> DeleteTour(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var success = await _mediator.Send(new DeleteTourCommand(id, Guid.Parse(userId)));
        return success ? Ok() : NotFound("Tour not found or you don't have permission to delete it.");
    }
}
