using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Admin.Queries;

public record PendingVerificationDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string RegistrationNumber,
    DateTime? LicenseExpirationDate,
    DateTime CreatedAt
);

public record GetPendingVerificationsQuery() : IRequest<List<PendingVerificationDto>>;

public class GetPendingVerificationsQueryHandler : IRequestHandler<GetPendingVerificationsQuery, List<PendingVerificationDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPendingVerificationsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PendingVerificationDto>> Handle(GetPendingVerificationsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .Include(u => u.GuideProfile)
            .Where(u => u.GuideProfile != null && u.GuideProfile.VerificationStatus == Domain.Enums.VerificationStatus.Pending)
            .Select(u => new PendingVerificationDto(
                u.Id,
                u.FullName,
                u.Email,
                u.Role.ToString(),
                u.GuideProfile!.RegistrationNumber ?? "",
                u.GuideProfile.LicenseExpirationDate,
                u.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
