using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Infrastructure.Services;

public class GamificationService : IGamificationService
{
    private readonly IApplicationDbContext _context;

    public GamificationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(int NewXP, int NewLevel, bool LeveledUp)> AddXPAsync(Guid userId, int xpAmount, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null) return (0, 1, false);

        user.XP += xpAmount;
        int oldLevel = user.Level;
        
        // Level Up Formula: Required XP = (Level^2) * 100
        // To find Level from XP: Level = sqrt(XP/100)
        int newLevel = (int)Math.Floor(Math.Sqrt(user.XP / 100.0)) + 1;
        
        bool leveledUp = false;
        if (newLevel > oldLevel)
        {
            user.Level = newLevel;
            leveledUp = true;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return (user.XP, user.Level, leveledUp);
    }

    public async Task<bool> AwardBadgeAsync(Guid userId, Guid badgeId, CancellationToken cancellationToken)
    {
        bool alreadyEarned = await _context.UserBadges
            .AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badgeId, cancellationToken);

        if (alreadyEarned) return false;

        var userBadge = new UserBadge
        {
            UserId = userId,
            BadgeId = badgeId,
            EarnedDate = DateTime.UtcNow
        };

        _context.UserBadges.Add(userBadge);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var R = 6371e3; // Earth radius in meters
        var phi1 = lat1 * Math.PI / 180;
        var phi2 = lat2 * Math.PI / 180;
        var deltaPhi = (lat2 - lat1) * Math.PI / 180;
        var deltaLambda = (lon2 - lon1) * Math.PI / 180;

        var a = Math.Sin(deltaPhi / 2) * Math.Sin(deltaPhi / 2) +
                Math.Cos(phi1) * Math.Cos(phi2) *
                Math.Sin(deltaLambda / 2) * Math.Sin(deltaLambda / 2);
        
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return R * c; // Distance in meters
    }
}
