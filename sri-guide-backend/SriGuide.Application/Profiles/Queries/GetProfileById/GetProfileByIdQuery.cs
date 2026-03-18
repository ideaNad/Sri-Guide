using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Queries.GetProfileById;

public record GetProfileByIdQuery(Guid Id) : IRequest<ProfileDetailDto?>;

public class GetProfileByIdQueryHandler : IRequestHandler<GetProfileByIdQuery, ProfileDetailDto?>
{
    private readonly IApplicationDbContext _context;

    public GetProfileByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProfileDetailDto?> Handle(GetProfileByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.GuideProfile)
            .Include(u => u.AgencyProfile)
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null) return null;

        // Calculate Average Rating
        var reviews = await _context.Reviews
            .Where(r => r.TargetId == user.Id)
            .ToListAsync(cancellationToken);
        
        double avgRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
        int reviewCount = reviews.Count;

        return new ProfileDetailDto(
            user.Id,
            user.FullName,
            user.Email,
            user.ProfileImageUrl,
            user.Role,
            user.GuideProfile?.Bio ?? user.AgencyProfile?.CompanyName, // Basic bio fallback
            user.GuideProfile?.Languages,
            user.GuideProfile?.Specialty,
            user.GuideProfile?.DailyRate,
            user.AgencyProfile?.CompanyName,
            user.AgencyProfile?.RegistrationNumber,
            user.IsVerified || (user.GuideProfile?.IsVerified ?? false) || (user.AgencyProfile?.IsVerified ?? false),
            avgRating,
            reviewCount
        );
    }
}
