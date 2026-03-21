using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Bookings.Commands;
using SriGuide.Domain.Enums;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BookingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateBookingCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(command with { CustomerId = Guid.Parse(userId) });
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] BookingStatus status)
    {
        var result = await _mediator.Send(new UpdateBookingStatusCommand(id, status));
        return result ? Ok() : NotFound();
    }
}
