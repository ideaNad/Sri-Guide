using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Admin.Queries;

public record AdminUserDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    bool IsVerified,
    DateTime CreatedAt
);

public record PaginatedResult<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);

public record GetAllUsersQuery(int Page, int PageSize, string? Role, string? Search) : IRequest<PaginatedResult<AdminUserDto>>;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, PaginatedResult<AdminUserDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<AdminUserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Role) && Enum.TryParse<Domain.Enums.UserRole>(request.Role, out var role))
        {
            query = query.Where(u => u.Role == role);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(u => u.FullName.ToLower().Contains(search) || u.Email.ToLower().Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(u => new AdminUserDto(
                u.Id,
                u.FullName,
                u.Email,
                u.Role.ToString(),
                u.IsVerified,
                u.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedResult<AdminUserDto>(items, totalCount, request.Page, request.PageSize);
    }
}
