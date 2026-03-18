using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Admin.Commands;
using SriGuide.Application.Admin.Queries;

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
}
