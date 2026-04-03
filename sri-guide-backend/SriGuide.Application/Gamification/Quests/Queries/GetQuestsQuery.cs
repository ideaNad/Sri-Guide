using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Gamification.Quests.Queries;

public class GetQuestsQuery : IRequest<List<QuestDto>>
{
    public Guid UserId { get; set; }
    public QuestCategory? Category { get; set; }
    public QuestDifficulty? Difficulty { get; set; }
}

public class GetQuestsQueryHandler : IRequestHandler<GetQuestsQuery, List<QuestDto>>
{
    private readonly IApplicationDbContext _context;

    public GetQuestsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuestDto>> Handle(GetQuestsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Quests
            .Include(q => q.RewardBadge)
            .Where(q => q.IsActive);

        if (request.Category.HasValue)
        {
            query = query.Where(q => q.Category == request.Category.Value);
        }

        if (request.Difficulty.HasValue)
        {
            query = query.Where(q => q.Difficulty == request.Difficulty.Value);
        }

        var userCompletions = await _context.QuestSubmissions
            .Where(qs => qs.UserId == request.UserId && qs.Status == QuestSubmissionStatus.Approved)
            .Select(qs => qs.QuestId)
            .ToListAsync(cancellationToken);

        var quests = await query
            .Select(q => new QuestDto
            {
                Id = q.Id,
                Name = q.Name,
                Description = q.Description,
                LocationName = q.LocationName,
                Latitude = q.Latitude,
                Longitude = q.Longitude,
                ProximityRadiusInMeters = q.ProximityRadiusInMeters,
                Category = q.Category,
                Difficulty = q.Difficulty,
                EstimatedTime = q.EstimatedTime,
                RewardXP = q.RewardXP,
                RewardBadgeName = q.RewardBadge != null ? q.RewardBadge.Name : null,
                RewardBadgeIconUrl = q.RewardBadge != null ? q.RewardBadge.IconUrl : null,
                RewardTitle = q.RewardTitle,
                PhotoRequirement = q.PhotoRequirement,
                IconUrl = q.IconUrl,
                IsCompletedByUser = userCompletions.Contains(q.Id)
            })
            .ToListAsync(cancellationToken);

        return quests;
    }
}
