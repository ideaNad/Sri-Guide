using MediatR;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Discovery.Queries;
using SriGuide.Application.Trips.Queries;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiscoveryController : ControllerBase
{
    private readonly IMediator _mediator;

    public DiscoveryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? query, 
        [FromQuery] string? type,
        [FromQuery] List<string>? languages,
        [FromQuery] List<string>? specialties,
        [FromQuery] List<string>? areas)
    {
        var result = await _mediator.Send(new GetDiscoveryQuery(query, type, languages, specialties, areas));
        return Ok(result);
    }

    [HttpGet("recent-trips")]
    public async Task<IActionResult> GetRecentTrips()
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Guid? userIdObj = !string.IsNullOrEmpty(currentUserId) ? Guid.Parse(currentUserId) : null;

        var result = await _mediator.Send(new GetRecentTripsQuery(userIdObj));
        return Ok(result);
    }

    [HttpGet("popular-tours")]
    public async Task<IActionResult> GetPopularTours()
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Guid? userIdObj = !string.IsNullOrEmpty(currentUserId) ? Guid.Parse(currentUserId) : null;

        var result = await _mediator.Send(new GetPopularToursQuery(userIdObj));
        return Ok(result);
    }
}
