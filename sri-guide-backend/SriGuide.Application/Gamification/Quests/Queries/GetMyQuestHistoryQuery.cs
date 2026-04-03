using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Gamification.Quests.Queries;

public record GetMyQuestHistoryQuery(Guid UserId) : IRequest<List<QuestStoryDto>>;

public class GetMyQuestHistoryQueryHandler : IRequestHandler<GetMyQuestHistoryQuery, List<QuestStoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetMyQuestHistoryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuestStoryDto>> Handle(GetMyQuestHistoryQuery request, CancellationToken cancellationToken)
    {
        return await _context.QuestSubmissions
            .Include(s => s.Quest)
            .Where(s => s.UserId == request.UserId && s.Status == QuestSubmissionStatus.Approved)
            .OrderByDescending(s => s.SubmissionDate)
            .Select(s => new QuestStoryDto
            {
                Id = s.Id,
                QuestName = s.Quest.Name,
                Description = s.Quest.Description,
                LocationName = s.Quest.LocationName,
                Category = s.Quest.Category.ToString(),
                Difficulty = s.Quest.Difficulty.ToString(),
                PhotoProofUrl = s.PhotoProofUrl,
                EarnedXP = s.EarnedXP,
                CompletedAt = s.SubmissionDate
            })
            .ToListAsync(cancellationToken);
    }
}
