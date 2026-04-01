using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Application.Common.Models;
using SriGuide.Domain.Enums;
using System.Linq;

namespace SriGuide.Application.Agencies.Queries;

public record GetAgencyGuidesQuery(Guid UserId, int PageNumber = 1, int PageSize = 6) : IRequest<PaginatedResult<AgencyGuideDto>>;

public class GetAgencyGuidesQueryHandler : IRequestHandler<GetAgencyGuidesQuery, PaginatedResult<AgencyGuideDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyGuidesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<AgencyGuideDto>> Handle(GetAgencyGuidesQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted || g.AgencyRecruitmentStatus == RecruitmentStatus.Requested))
                .ThenInclude(g => g.User)
            .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted || g.AgencyRecruitmentStatus == RecruitmentStatus.Requested))
                .ThenInclude(g => g.Trips)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new PaginatedResult<AgencyGuideDto>(new List<AgencyGuideDto>(), 0, request.PageNumber, request.PageSize);

        var guideUserIds = agency.Guides.Select(g => g.UserId).ToList();
        
        // Calculate real average ratings
        var ratings = await _context.Reviews
            .Where(r => guideUserIds.Contains(r.TargetId) && r.TargetType == "Guide")
            .GroupBy(r => r.TargetId)
            .Select(g => new { UserId = g.Key, AverageRating = Math.Round(g.Average(r => (double)r.Rating), 1) })
            .ToDictionaryAsync(x => x.UserId, x => x.AverageRating, cancellationToken);

        var allGuides = agency.Guides.Select(g => new AgencyGuideDto
        {
            Id = g.Id,
            UserId = g.UserId,
            Name = g.User?.FullName ?? "Unknown",
            Role = g.Specialties?.FirstOrDefault() ?? "Guide",
            Rating = ratings.GetValueOrDefault(g.UserId, 0.0), 
            Location = g.OperatingAreas?.FirstOrDefault() ?? "Sri Lanka",
            Status = g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted ? "Active" : "Approval Pending",
            TripCount = g.Trips.Count,
            ProfileImageUrl = g.User?.ProfileImageUrl,
            Slug = g.User?.Slug,
            IsOwner = g.UserId == agency.UserId
        }).ToList();

        var count = allGuides.Count;
        var items = allGuides.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToList();

        return new PaginatedResult<AgencyGuideDto>(items, count, request.PageNumber, request.PageSize);
    }
}
