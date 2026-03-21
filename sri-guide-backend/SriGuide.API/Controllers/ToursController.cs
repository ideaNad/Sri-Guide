using SriGuide.Application.Trips.Commands;
using SriGuide.Application.Trips.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "TravelAgency")]
public class ToursController : ControllerBase
{
    private readonly IMediator _mediator;

    public ToursController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<TourDetailDto>> GetTourById(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? currentUserId = userId != null ? Guid.Parse(userId) : null;

        var result = await _mediator.Send(new GetTourDetailQuery(id, currentUserId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTour([FromBody] CreateTourCommand command)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId"); // Assuming AgencyProfileId is in claims
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found for this user");

        var result = await _mediator.Send(command with { AgencyId = Guid.Parse(agencyIdString) });
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTour(Guid id, [FromBody] UpdateTourCommand command)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        if (id != command.TourId) return BadRequest("Tour ID mismatch");

        var success = await _mediator.Send(command with { AgencyId = Guid.Parse(agencyIdString) });
        if (!success) return NotFound("Tour not found or unauthorized");

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTour(Guid id)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var success = await _mediator.Send(new DeleteTourCommand(id, Guid.Parse(agencyIdString)));
        if (!success) return NotFound("Tour not found or unauthorized");

        return Ok();
    }

    [HttpPost("{tourId}/upload-photo")]
    public async Task<IActionResult> UploadTourPhoto(Guid tourId, IFormFile file)
    {
        var agencyIdString = User.FindFirstValue("AgencyProfileId");
        if (string.IsNullOrEmpty(agencyIdString)) return BadRequest("Agency Profile not found");

        var result = await _mediator.Send(new UploadTourImageCommand(tourId, Guid.Parse(agencyIdString), file));
        return Ok(new { ImageUrl = result });
    }
}
