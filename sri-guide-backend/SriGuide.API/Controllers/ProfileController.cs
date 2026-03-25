using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Profiles.Commands;
using SriGuide.Application.Profiles.Queries;
using SriGuide.Application.Profiles.DTOs;
using SriGuide.Application.Profiles.Queries.GetProfileById;
using System.Security.Claims;
using SriGuide.Application.Agencies.Commands;
using SriGuide.Application.Agencies.Queries;

namespace SriGuide.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var query = new GetUserProfileQuery(Guid.Parse(userId));
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProfileDetailDto>> GetPublicProfile(Guid id)
    {
        var result = await _mediator.Send(new GetProfileByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("guide-dashboard")]
    [Authorize(Roles = "Guide")]
    public async Task<ActionResult<GuideDashboardDto>> GetGuideDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var query = new GetGuideDashboardQuery(Guid.Parse(userId));
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("request-verification")]
    [Authorize(Roles = "Guide,TravelAgency")]
    public async Task<IActionResult> RequestVerification([FromBody] RequestVerificationCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(command with { UserId = Guid.Parse(userId) });
        return Ok(result);
    }

    [HttpGet("public/{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<PublicProfileDto>> GetDetailedPublicProfile(string id, [FromQuery] string? type = null)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userIdObj = !string.IsNullOrEmpty(currentUserId) ? Guid.Parse(currentUserId) : null;
        
        var result = await _mediator.Send(new GetPublicProfileQuery(id, userIdObj, type));
        return Ok(result);
    }

    [HttpPost("upload-photo")]
    public async Task<ActionResult<string>> UploadPhoto([FromForm] IFormFile file)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(new UploadProfilePictureCommand(Guid.Parse(userId), file));
        return Ok(result);
    }

    [HttpPost("update-user")]
    public async Task<ActionResult<bool>> UpdateUser(UpdateUserProfileCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || Guid.Parse(userId) != command.UserId) return Forbid();

        return await _mediator.Send(command);
    }

    [HttpPost("update-guide")]
    [Authorize(Roles = "Guide,TravelAgency")]
    public async Task<ActionResult<bool>> UpdateGuideProfile([FromBody] UpdateGuideProfileCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || Guid.Parse(userId) != command.UserId) return Forbid();

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("tourist-dashboard")]
    public async Task<ActionResult<TouristDashboardDto>> GetTouristDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var query = new GetTouristDashboardQuery(Guid.Parse(userId));
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("my-plans")]
    public async Task<ActionResult<List<PlanDto>>> GetMyPlans()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var query = new GetMyPlansQuery(Guid.Parse(userId));
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("upgrade-to-agency")]
    [Authorize(Roles = "Guide")]
    public async Task<IActionResult> UpgradeToAgency([FromBody] UpgradeToAgencyCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(command with { UserId = Guid.Parse(userId) });
        return Ok(result);
    }

    [HttpPost("reset-agency-upgrade")]
    [Authorize(Roles = "Guide")]
    public async Task<IActionResult> ResetAgencyUpgrade()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(new ResetAgencyUpgradeCommand(Guid.Parse(userId)));
        return Ok(result);
    }

    [HttpGet("agency")]
    [Authorize(Roles = "TravelAgency")]
    public async Task<ActionResult<AgencyProfileDto>> GetAgencyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(new GetAgencyProfileQuery(Guid.Parse(userId)));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("agency/update")]
    [Authorize(Roles = "TravelAgency")]
    public async Task<ActionResult<bool>> UpdateAgencyProfile([FromBody] UpdateAgencyProfileCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || Guid.Parse(userId) != command.UserId) return Forbid();

        return await _mediator.Send(command);
    }

    [HttpPost("organizer/update")]
    [Authorize(Roles = "EventOrganizer")]
    public async Task<ActionResult<bool>> UpdateOrganizerProfile([FromBody] UpdateEventOrganizerProfileCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || Guid.Parse(userId) != command.UserId) return Forbid();

        return await _mediator.Send(command);
    }

    [HttpPost("respond-to-offer")]
    [Authorize(Roles = "Guide")]
    public async Task<IActionResult> RespondToOffer([FromBody] RespondToAgencyOfferCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _mediator.Send(command with { GuideUserId = Guid.Parse(userId) });
        return success ? Ok() : BadRequest("Offer not found or already processed");
    }
}
