using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Feedbacks.Commands;
using SriGuide.Application.Feedbacks.DTOs;
using SriGuide.Application.Feedbacks.Queries;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IMediator _mediator;

    public FeedbackController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> SubmitFeedback([FromBody] SubmitFeedbackCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<FeedbackDto>>> GetFeedbacks()
    {
        var result = await _mediator.Send(new GetFeedbacksQuery());
        return Ok(result);
    }
}
