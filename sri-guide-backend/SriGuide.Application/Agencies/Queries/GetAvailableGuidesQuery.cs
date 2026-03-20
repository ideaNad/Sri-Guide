using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Agencies.Queries;

public record AvailableGuideDto(
    Guid Id,
    string Name,
    string? ProfileImageUrl,
    string Location
);

public record GetAvailableGuidesQuery(string? SearchTerm = null) : IRequest<List<AvailableGuideDto>>;

public class GetAvailableGuidesQueryHandler : IRequestHandler<GetAvailableGuidesQuery, List<AvailableGuideDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAvailableGuidesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AvailableGuideDto>> Handle(GetAvailableGuidesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.GuideProfiles
            .Include(g => g.User)
            .Where(g => g.AgencyId == null);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(g => 
                g.User.FullName.ToLower().Contains(term) || 
                g.User.Email.ToLower().Contains(term) || 
                (g.PhoneNumber != null && g.PhoneNumber.Contains(term))
            );
        }

        return await query
            .Select(g => new AvailableGuideDto(
                g.UserId,
                g.User.FullName,
                g.User.ProfileImageUrl,
                g.OperatingAreas != null && g.OperatingAreas.Any() ? g.OperatingAreas.First() : "Sri Lanka"
            ))
            .ToListAsync(cancellationToken);
    }
}
