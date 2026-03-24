using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Admin.Commands;
using SriGuide.Application.Admin.Queries;
using SriGuide.Application.Admin.DTOs;

namespace SriGuide.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("pending-upgrades")]
    public async Task<ActionResult<List<SriGuide.Application.Admin.DTOs.AgencyApprovalDto>>> GetPendingUpgrades()
    {
        return await _mediator.Send(new GetPendingUpgradesQuery());
    }

    [HttpPost("approve-agency/{id}")]
    public async Task<ActionResult<bool>> ApproveAgency(Guid id)
    {
        return await _mediator.Send(new ApproveAgencyCommand(id));
    }

    [HttpPost("reject-agency/{id}")]
    public async Task<ActionResult<bool>> RejectAgency(Guid id)
    {
        return await _mediator.Send(new RejectAgencyCommand(id));
    }

    [HttpPost("verify-guide/{id}")]
    public async Task<IActionResult> VerifyGuide(Guid id, [FromBody] VerifyGuideCommand command)
    {
        var result = await _mediator.Send(command with { GuideProfileId = id });
        return Ok(result);
    }

    [HttpGet("pending-verifications")]
    public async Task<ActionResult<List<PendingVerificationDto>>> GetPendingVerifications()
    {
        var result = await _mediator.Send(new GetPendingVerificationsQuery());
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? role = null, [FromQuery] string? search = null)
    {
        var result = await _mediator.Send(new GetAllUsersQuery(page, pageSize, role, search));
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<AdminStatsDto>> GetStats()
    {
        var result = await _mediator.Send(new GetAdminStatsQuery());
        return Ok(result);
    }
    
    [HttpDelete("agency/{id}")]
    public async Task<ActionResult<bool>> DeleteAgency(Guid id)
    {
        return await _mediator.Send(new DeleteAgencyCommand(id));
    }

    [HttpDelete("guide/{id}")]
    public async Task<ActionResult<bool>> DeleteGuide(Guid id)
    {
        return await _mediator.Send(new DeleteGuideCommand(id));
    }

    [HttpDelete("user/{id}")]
    public async Task<ActionResult<bool>> DeleteUser(Guid id)
    {
        return await _mediator.Send(new DeleteUserCommand(id));
    }
}
