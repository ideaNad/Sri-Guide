using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Profiles.Commands;

public record CreateTripCommand(Guid? GuideId, string Title, string Description, string Location, DateTime? Date, Guid? AgencyId = null) : IRequest<Guid>;

public class CreateTripCommandHandler : IRequestHandler<CreateTripCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateTripCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTripCommand request, CancellationToken cancellationToken)
    {
        var trip = new Trip
        {
            GuideId = request.GuideId,
            AgencyId = request.AgencyId,
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            Date = request.Date.HasValue ? DateTime.SpecifyKind(request.Date.Value, DateTimeKind.Utc) : null
        };

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync(cancellationToken);

        return trip.Id;
    }
}
