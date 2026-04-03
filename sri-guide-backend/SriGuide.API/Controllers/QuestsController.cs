using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Gamification.Quests.Commands;
using SriGuide.Application.Gamification.Quests.Queries;
using System.Security.Claims;
using SriGuide.Domain.Enums;

namespace SriGuide.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public QuestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestDto>>> GetQuests([FromQuery] QuestCategory? category, [FromQuery] QuestDifficulty? difficulty)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new GetQuestsQuery 
        { 
            UserId = userId,
            Category = category, 
            Difficulty = difficulty 
        });
        return Ok(result);
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult<QuestSubmissionResult>> SubmitProof(Guid id, [FromBody] SubmitProofRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new SubmitQuestProofCommand
        {
            UserId = userId,
            QuestId = id,
            PhotoProofUrl = request.PhotoProofUrl,
            Latitude = request.Latitude,
            Longitude = request.Longitude
        });

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("my-history")]
    public async Task<ActionResult<List<QuestStoryDto>>> GetMyHistory()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new GetMyQuestHistoryQuery(userId));
        return Ok(result);
    }
}

public class SubmitProofRequest
{
    public string PhotoProofUrl { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
