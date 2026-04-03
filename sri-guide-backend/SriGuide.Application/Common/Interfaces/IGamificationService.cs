namespace SriGuide.Application.Common.Interfaces;

public interface IGamificationService
{
    Task<(int NewXP, int NewLevel, bool LeveledUp)> AddXPAsync(Guid userId, int xpAmount, CancellationToken cancellationToken);
    Task<bool> AwardBadgeAsync(Guid userId, Guid badgeId, CancellationToken cancellationToken);
    double CalculateDistance(double lat1, double lon1, double lat2, double lon2);
}
