using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Events.Commands.CreateEventReview;

public record CreateEventReviewCommand : IRequest<Unit>
{
    public Guid EventId { get; init; }
    public Guid UserId { get; set; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
}

public class CreateEventReviewCommandHandler : IRequestHandler<CreateEventReviewCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public CreateEventReviewCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(CreateEventReviewCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        if (user.Role != UserRole.Tourist)
        {
            throw new Exception("Only tourists can review events.");
        }

        var review = new EventReview
        {
            EventId = request.EventId,
            UserId = request.UserId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _context.EventReviews.Add(review);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
