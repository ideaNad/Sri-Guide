using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Application.Agencies.Queries;
using SriGuide.Application.Agencies.Commands;
using SriGuide.Application.Common.Models;
using SriGuide.Application.Trips.Commands;
using SriGuide.Application.Profiles.Commands;
using SriGuide.Domain.Enums;
using System.Security.Claims;
using SriGuide.Application.Trips.Queries;

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

    [HttpGet("tours")]
    public async Task<ActionResult<List<AgencyTripDto>>> GetTours()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyToursQuery(Guid.Parse(userId)));
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
        
        var agency = await _mediator.Send(new GetAgencyProfileQuery(Guid.Parse(userId)));
        if (agency == null) return NotFound("Agency profile not found");
        
        var success = await _mediator.Send(command with { AgencyId = agency.Id });
        return success ? Ok() : BadRequest("Guide not found or already in agency");
    }

    [HttpPost("guides/remove")]
    public async Task<IActionResult> RemoveGuide([FromBody] RemoveGuideFromAgencyCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var agency = await _mediator.Send(new GetAgencyProfileQuery(Guid.Parse(userId)));
        if (agency == null) return NotFound("Agency profile not found");

        var success = await _mediator.Send(command with { AgencyId = agency.Id });
        return success ? Ok() : BadRequest("Guide not found or not part of this agency");
    }

    [HttpPost("trips")]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripCommand command)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var result = await _mediator.Send(command with { AgencyId = Guid.Parse(agencyIdString) });
        return Ok(result);
    }

    [HttpPut("trips/{id}")]
    public async Task<IActionResult> UpdateTrip(Guid id, [FromBody] UpdateTripCommand command)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        if (id != command.TripId) return BadRequest("Trip ID mismatch");

        var success = await _mediator.Send(command with { AgencyId = Guid.Parse(agencyIdString) });
        if (!success) return NotFound("Trip not found or unauthorized");

        return Ok();
    }

    [HttpDelete("trips/{id}")]
    public async Task<IActionResult> DeleteTrip(Guid id)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var success = await _mediator.Send(new DeleteTripCommand(id, null, Guid.Parse(agencyIdString)));
        if (!success) return NotFound("Trip not found or unauthorized");

        return Ok();
    }

    [HttpPost("trips/{tripId}/upload-photo")]
    public async Task<IActionResult> UploadTripPhoto(Guid tripId, IFormFile file)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var result = await _mediator.Send(new UploadTripImageCommand(tripId, null, Guid.Parse(agencyIdString), file));
        return Ok(new { ImageUrl = result });
    }

    [HttpDelete("trips/{tripId}/photo")]
    public async Task<IActionResult> DeleteTripPhoto(Guid tripId, [FromQuery] string imageUrl)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var success = await _mediator.Send(new DeleteTripImageCommand(tripId, null, imageUrl, Guid.Parse(agencyIdString)));
        if (!success) return NotFound("Trip or image not found or unauthorized");

        return Ok();
    }

    [HttpPost("tours")]
    public async Task<IActionResult> CreateTour([FromBody] CreateTourCommand command)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var result = await _mediator.Send(command with { AgencyId = Guid.Parse(agencyIdString) });
        return Ok(result);
    }

    [HttpPut("tours/{id}")]
    public async Task<IActionResult> UpdateTour(Guid id, [FromBody] UpdateTourCommand command)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        if (id != command.TourId) return BadRequest("Tour ID mismatch");

        var success = await _mediator.Send(command with { AgencyId = Guid.Parse(agencyIdString) });
        if (!success) return NotFound("Tour not found or unauthorized");

        return Ok();
    }

    [HttpDelete("tours/{id}")]
    public async Task<IActionResult> DeleteTour(Guid id)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var success = await _mediator.Send(new DeleteTourCommand(id, Guid.Parse(agencyIdString)));
        if (!success) return NotFound("Tour not found or unauthorized");

        return Ok();
    }

    [HttpPost("tours/{tourId}/upload-photo")]
    public async Task<IActionResult> UploadTourPhoto(Guid tourId, IFormFile file)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var result = await _mediator.Send(new UploadTourImageCommand(tourId, Guid.Parse(agencyIdString), file));
        return Ok(new { ImageUrl = result });
    }
}
