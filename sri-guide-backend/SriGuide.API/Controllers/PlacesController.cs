using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Places.Commands;
using SriGuide.Application.Places.Queries;
using SriGuide.Application.Places.DTOs;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlacesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlacesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<PopularPlaceDto>>> GetPlaces()
    {
        return await _mediator.Send(new GetPopularPlacesQuery());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PopularPlaceDto>> GetPlace(string id)
    {
        var result = await _mediator.Send(new GetPopularPlaceByIdQuery(id));
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Guid>> CreatePlace([FromBody] CreatePopularPlaceCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<bool>> UpdatePlace(Guid id, [FromBody] UpdatePopularPlaceCommand command)
    {
        if (id != command.Id)
            return BadRequest();
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeletePlace(Guid id)
    {
        return await _mediator.Send(new DeletePopularPlaceCommand(id));
    }
}
