using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Reviews.Commands;

public record CreateReviewCommand(
    Guid UserId,
    Guid TargetId,
    string TargetType,
    int Rating,
    string Comment
) : IRequest<bool>;

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public CreateReviewCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = new Review
        {
            UserId = request.UserId,
            TargetId = request.TargetId,
            TargetType = request.TargetType,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
