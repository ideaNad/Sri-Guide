using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Feedbacks.DTOs;

namespace SriGuide.Application.Feedbacks.Queries;

public record GetFeedbacksQuery : IRequest<List<FeedbackDto>>;

public class GetFeedbacksQueryHandler : IRequestHandler<GetFeedbacksQuery, List<FeedbackDto>>
{
    private readonly IApplicationDbContext _context;

    public GetFeedbacksQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<FeedbackDto>> Handle(GetFeedbacksQuery request, CancellationToken cancellationToken)
    {
        return await _context.Feedbacks
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FeedbackDto
            {
                Id = f.Id,
                Name = f.Name,
                Email = f.Email,
                Subject = f.Subject,
                Message = f.Message,
                CreatedAt = f.CreatedAt,
                IsReviewed = f.IsReviewed
            })
            .ToListAsync(cancellationToken);
    }
}
