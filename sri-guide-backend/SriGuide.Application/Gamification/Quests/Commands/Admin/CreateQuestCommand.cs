using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Gamification.Quests.Commands.Admin;

public class CreateQuestCommand : IRequest<Guid>
{
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

public class CreateQuestCommandHandler : IRequestHandler<CreateQuestCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateQuestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateQuestCommand request, CancellationToken cancellationToken)
    {
        var quest = new Quest
        {
            Name = request.Name,
            Description = request.Description,
            LocationName = request.LocationName,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ProximityRadiusInMeters = request.ProximityRadiusInMeters,
            Category = request.Category,
            Difficulty = request.Difficulty,
            EstimatedTime = request.EstimatedTime,
            RewardXP = request.RewardXP,
            RewardBadgeId = request.RewardBadgeId,
            RewardTitle = request.RewardTitle,
            PhotoRequirement = request.PhotoRequirement,
            IconUrl = request.IconUrl,
            IsActive = request.IsActive,
            CreatedAt = System.DateTime.UtcNow
        };

        _context.Quests.Add(quest);
        await _context.SaveChangesAsync(cancellationToken);

        return quest.Id;
    }
}
