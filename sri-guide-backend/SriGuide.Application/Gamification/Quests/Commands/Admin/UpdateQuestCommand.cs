using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Gamification.Quests.Commands.Admin;

public class UpdateQuestCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LocationName { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double ProximityRadiusInMeters { get; set; } = 500;
    
    public QuestCategory Category { get; set; }
    public QuestDifficulty Difficulty { get; set; }
    public string? EstimatedTime { get; set; }
    
    public int RewardXP { get; set; }
    public Guid? RewardBadgeId { get; set; }
    public string? RewardTitle { get; set; }
    public string PhotoRequirement { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateQuestCommandHandler : IRequestHandler<UpdateQuestCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateQuestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateQuestCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Quests.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            return false;

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.LocationName = request.LocationName;
        entity.Latitude = request.Latitude;
        entity.Longitude = request.Longitude;
        entity.ProximityRadiusInMeters = request.ProximityRadiusInMeters;
        entity.Category = request.Category;
        entity.Difficulty = request.Difficulty;
        entity.EstimatedTime = request.EstimatedTime;
        entity.RewardXP = request.RewardXP;
        entity.RewardBadgeId = request.RewardBadgeId;
        entity.RewardTitle = request.RewardTitle;
        entity.PhotoRequirement = request.PhotoRequirement;
        entity.IconUrl = request.IconUrl;
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
