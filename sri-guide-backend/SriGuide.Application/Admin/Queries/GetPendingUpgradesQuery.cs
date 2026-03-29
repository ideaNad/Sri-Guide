using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Admin.DTOs;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Admin.Queries;

public record GetPendingUpgradesQuery() : IRequest<List<AgencyApprovalDto>>;

public class GetPendingUpgradesQueryHandler : IRequestHandler<GetPendingUpgradesQuery, List<AgencyApprovalDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPendingUpgradesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AgencyApprovalDto>> Handle(GetPendingUpgradesQuery request, CancellationToken cancellationToken)
    {
        return await _context.AgencyProfiles
            .Include(a => a.User)
            .Where(a => a.VerificationStatus == VerificationStatus.Pending)
            .Select(a => new AgencyApprovalDto(
                a.Id,
                a.UserId,
                a.User!.FullName,
                a.CompanyName,
                a.CompanyEmail ?? "",
                a.RegistrationNumber ?? "",
                a.Phone ?? "",
                a.WhatsApp ?? "",
                a.RegistrationDocUrl ?? "",
                a.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
