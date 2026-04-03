using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace SriGuide.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/quests")]
public class QuestAdminController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public QuestAdminController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Quest>>> GetAllQuests()
    {
        return await _context.Quests.Include(q => q.RewardBadge).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Quest>> CreateQuest([FromBody] Quest quest)
    {
        _context.Quests.Add(quest);
        await _context.SaveChangesAsync(default);
        return Ok(quest);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuest(Guid id, [FromBody] Quest quest)
    {
        if (id != quest.Id) return BadRequest();
        
        _context.Entry(quest).State = EntityState.Modified;
        await _context.SaveChangesAsync(default);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuest(Guid id)
    {
        var quest = await _context.Quests.FindAsync(id);
        if (quest == null) return NotFound();

        quest.IsActive = false; // Soft delete
        await _context.SaveChangesAsync(default);
        return NoContent();
    }
}
