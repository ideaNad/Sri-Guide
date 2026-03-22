using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Reviews.Queries;

public record ReviewDto(
    Guid Id,
    string ReviewerName,
    string? ReviewerImageUrl,
    int Rating,
    string? Comment,
    DateTime CreatedAt
);

public record GetReviewsQuery(Guid TargetId, string TargetType) : IRequest<List<ReviewDto>>;

public class GetReviewsQueryHandler : IRequestHandler<GetReviewsQuery, List<ReviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewDto>> Handle(GetReviewsQuery request, CancellationToken cancellationToken)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetId == request.TargetId && r.TargetType.ToLower() == request.TargetType.ToLower())
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);

        return reviews.Select(r => new ReviewDto(
            r.Id,
            r.User?.FullName ?? "Tourist",
            r.User?.ProfileImageUrl != null && !r.User.ProfileImageUrl.StartsWith("/") && !r.User.ProfileImageUrl.StartsWith("http") 
                ? "/" + r.User.ProfileImageUrl 
                : r.User?.ProfileImageUrl,
            r.Rating,
            r.Comment,
            r.CreatedAt
        )).ToList();
    }
}
