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
        var result = await _mediator.Send(new GetRecentTripsQuery());
        return Ok(result);
    }
}
