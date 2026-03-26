using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Transport.Commands.CreateVehicleReview;

public record CreateVehicleReviewCommand : IRequest<Guid>
{
    public Guid VehicleId { get; init; }
    public Guid UserId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
}

public class CreateVehicleReviewCommandHandler : IRequestHandler<CreateVehicleReviewCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateVehicleReviewCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateVehicleReviewCommand request, CancellationToken cancellationToken)
    {
        var review = new VehicleReview
        {
            VehicleId = request.VehicleId,
            UserId = request.UserId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _context.VehicleReviews.Add(review);
        await _context.SaveChangesAsync(cancellationToken);

        return review.Id;
    }
}
