using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Reviews.Commands;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReviewController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(command with { UserId = Guid.Parse(userId) });
        return Ok(result);
    }

    [HttpGet("guide-reviews")]
    [Authorize(Roles = "Guide")]
    public async Task<IActionResult> GetGuideReviews()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _mediator.Send(new SriGuide.Application.Reviews.Queries.GetGuideReviewsQuery(Guid.Parse(userId)));
        return Ok(result);
    }

    [HttpGet("guide/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGuideReviewsPublic(Guid id)
    {
        var result = await _mediator.Send(new SriGuide.Application.Reviews.Queries.GetGuideReviewsQuery(id));
        return Ok(result);
    }
}
