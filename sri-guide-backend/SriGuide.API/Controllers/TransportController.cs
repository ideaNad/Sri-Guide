using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using SriGuide.Application.Transport.Queries;
using SriGuide.Application.Transport.Commands;
using SriGuide.Application.Transport.Commands.ToggleVehicleLike;
using SriGuide.Application.Transport.Commands.CreateVehicleReview;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransportController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearby(
        [FromQuery] double lat, 
        [FromQuery] double lng, 
        [FromQuery] double radius = 10,
        [FromQuery] string? vehicleType = null,
        [FromQuery] int? minCapacity = null,
        [FromQuery] bool? driverIncluded = null,
        [FromQuery] bool? hasAc = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdString != null ? Guid.Parse(userIdString) : null;
        
        var result = await _mediator.Send(new NearbyTransportSearchQuery(
            lat, lng, radius, 
            vehicleType, minCapacity, driverIncluded, hasAc, 
            page, pageSize, userId));
            
        return Ok(result);
    }

    [Authorize]
    [HttpGet("my-vehicles")]
    public async Task<IActionResult> GetMyVehicles()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new GetMyVehiclesQuery(userId));
        return Ok(result);
    }

    [Authorize]
    [HttpPost("vehicles")]
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleCommand command)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(command with { UserId = userId });
        return Ok(result);
    }

    [Authorize]
    [HttpPut("vehicles/{id}")]
    public async Task<IActionResult> UpdateVehicle(Guid id, [FromBody] UpdateVehicleCommand command)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(command with { VehicleId = id, UserId = userId });
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("vehicles/{id}")]
    public async Task<IActionResult> DeleteVehicle(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new DeleteVehicleCommand(id, userId));
        return Ok(result);
    }

    [Authorize(Roles = "Tourist")]
    [HttpPost("vehicles/{id}/like")]
    public async Task<IActionResult> ToggleLike(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new ToggleVehicleLikeCommand(id, userId));
        return Ok(result);
    }

    [Authorize(Roles = "Tourist")]
    [HttpPost("vehicles/{id}/reviews")]
    public async Task<IActionResult> AddReview(Guid id, [FromBody] CreateVehicleReviewCommand command)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(command with { VehicleId = id, UserId = userId });
        return Ok(result);
    }

    [Authorize]
    [HttpPost("vehicles/{id}/upload-photo")]
    public async Task<IActionResult> UploadVehiclePhoto(Guid id, IFormFile file)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new UploadVehiclePhotoCommand(id, userId, file));
        return Ok(new { url = result });
    }

    [Authorize]
    [HttpPost("toggle-availability")]
    public async Task<IActionResult> ToggleDiscoverable()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new ToggleTransportAvailabilityCommand(userId));
        return Ok(new { isAvailable = result });
    }

    [Authorize]
    [HttpPost("vehicles/{id}/toggle-availability")]
    public async Task<IActionResult> ToggleVehicleAvailability(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new ToggleVehicleAvailabilityCommand(id, userId));
        return Ok(new { isAvailable = result });
    }

    [HttpGet("vehicles/{id}")]
    public async Task<IActionResult> GetVehicleDetail(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdString != null ? Guid.Parse(userIdString) : null;
        var result = await _mediator.Send(new GetVehicleDetailQuery(id, userId));
        return Ok(result);
    }

    [HttpGet("profile/{id}")]
    public async Task<IActionResult> GetTransportProfileById(Guid id)
    {
        var result = await _mediator.Send(new GetTransportProfileByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }
}
