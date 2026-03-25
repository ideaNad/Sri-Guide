using MediatR;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.EventCategories.Queries.GetCategories;
using SriGuide.Application.EventCategories.DTOs;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/event-categories")]
public class EventCategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventCategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<EventCategoryDto>>> GetCategories()
    {
        return await _mediator.Send(new GetCategoriesQuery());
    }
}
