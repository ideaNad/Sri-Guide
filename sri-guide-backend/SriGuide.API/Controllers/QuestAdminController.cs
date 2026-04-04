using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Gamification.Quests.Commands.Admin;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/quests")]
public class QuestAdminController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IApplicationDbContext _context;

    public QuestAdminController(IMediator mediator, IApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Quest>>> GetAllQuests()
    {
        return await _context.Quests.Include(q => q.RewardBadge).OrderByDescending(q => q.CreatedAt).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateQuest([FromBody] CreateQuestCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuest(Guid id, [FromBody] UpdateQuestCommand command)
    {
        if (id != command.Id) return BadRequest();
        
        var result = await _mediator.Send(command);
        if (!result) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuest(Guid id)
    {
        var quest = await _context.Quests.FindAsync(id);
        if (quest == null) return NotFound();

        quest.IsActive = !quest.IsActive; // Toggle active status for management
        await _context.SaveChangesAsync(default);
        return NoContent();
    }
}
