using MediatR;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Discovery.Queries;

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
    public async Task<IActionResult> Get([FromQuery] string? query, [FromQuery] string? type)
    {
        var result = await _mediator.Send(new GetDiscoveryQuery(query, type));
        return Ok(result);
    }
}
