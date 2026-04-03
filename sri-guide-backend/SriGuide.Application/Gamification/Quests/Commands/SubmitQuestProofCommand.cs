using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Gamification.Quests.Commands;

public class SubmitQuestProofCommand : IRequest<QuestSubmissionResult>
{
    public Guid UserId { get; set; }
    public Guid QuestId { get; set; }
    public string PhotoProofUrl { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class QuestSubmissionResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int EarnedXP { get; set; }
    public int NewTotalXP { get; set; }
    public int CurrentLevel { get; set; }
    public bool LeveledUp { get; set; }
    public string? EarnedBadgeName { get; set; }
}

public class SubmitQuestProofCommandHandler : IRequestHandler<SubmitQuestProofCommand, QuestSubmissionResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IGamificationService _gamificationService;

    public SubmitQuestProofCommandHandler(IApplicationDbContext context, IGamificationService gamificationService)
    {
        _context = context;
        _gamificationService = gamificationService;
    }

    public async Task<QuestSubmissionResult> Handle(SubmitQuestProofCommand request, CancellationToken cancellationToken)
    {
        var quest = await _context.Quests
            .Include(q => q.RewardBadge)
            .FirstOrDefaultAsync(q => q.Id == request.QuestId, cancellationToken);
            
        if (quest == null)
            return new QuestSubmissionResult { Success = false, Message = "Quest not found." };

        // Check proximity
        var distance = _gamificationService.CalculateDistance(request.Latitude, request.Longitude, quest.Latitude, quest.Longitude);
        
        if (distance > quest.ProximityRadiusInMeters)
        {
            return new QuestSubmissionResult 
            { 
                Success = false, 
                Message = $"Out of range. You are {Math.Round(distance)}m away, but need to be within {quest.ProximityRadiusInMeters}m." 
            };
        }

        // Check if already completed
        var alreadyCompleted = await _context.QuestSubmissions
            .AnyAsync(s => s.UserId == request.UserId && s.QuestId == request.QuestId && s.Status == QuestSubmissionStatus.Approved, cancellationToken);
            
        if (alreadyCompleted)
            return new QuestSubmissionResult { Success = false, Message = "Quest already completed." };

        // Create submission
        var submission = new QuestSubmission
        {
            UserId = request.UserId,
            QuestId = request.QuestId,
            PhotoProofUrl = request.PhotoProofUrl,
            SubmissionLatitude = request.Latitude,
            SubmissionLongitude = request.Longitude,
            Status = QuestSubmissionStatus.Approved, // Auto-approval as per plan
            SubmissionDate = DateTime.UtcNow,
            EarnedXP = quest.RewardXP
        };

        _context.QuestSubmissions.Add(submission);
        
        // Update user XP
        var prog = await _gamificationService.AddXPAsync(request.UserId, quest.RewardXP, cancellationToken);
        
        // Award badge if applicable
        string? earnedBadgeName = null;
        if (quest.RewardBadgeId.HasValue)
        {
            var awarded = await _gamificationService.AwardBadgeAsync(request.UserId, quest.RewardBadgeId.Value, cancellationToken);
            if (awarded) earnedBadgeName = quest.RewardBadge?.Name;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new QuestSubmissionResult
        {
            Success = true,
            Message = "Quest completed successfully!",
            EarnedXP = quest.RewardXP,
            NewTotalXP = prog.NewXP,
            CurrentLevel = prog.NewLevel,
            LeveledUp = prog.LeveledUp,
            EarnedBadgeName = earnedBadgeName
        };
    }
}
