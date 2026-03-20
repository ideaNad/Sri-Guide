using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Trips.Commands;

public class CreateTourCommandHandler : IRequestHandler<CreateTourCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateTourCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTourCommand request, CancellationToken cancellationToken)
    {
        Guid? agencyProfileId = null;
        if (request.AgencyId.HasValue)
        {
            var agency = await _context.AgencyProfiles
                .FirstOrDefaultAsync(a => a.UserId == request.AgencyId.Value, cancellationToken);
            if (agency == null) throw new Exception("Agency profile not found for this user");
            agencyProfileId = agency.Id;
        }

        var trip = new Trip
        {
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            Category = request.Category,
            Price = request.Price,
            IsAgencyTour = agencyProfileId.HasValue,
            AgencyId = agencyProfileId,
            GuideId = request.GuideId, // Nullable
            Date = request.Date.HasValue ? DateTime.SpecifyKind(request.Date.Value, DateTimeKind.Utc) : null,
            Images = new List<TripImage>()
        };

        if (!string.IsNullOrEmpty(request.MainImageUrl))
        {
            trip.Images.Add(new TripImage
            {
                ImageUrl = request.MainImageUrl,
                Caption = "Main View"
            });
        }

        if (request.Itinerary != null)
        {
            trip.Itinerary = request.Itinerary.Select(s => new ItineraryStep
            {
                Time = s.Time,
                Title = s.Title,
                Description = s.Description,
                ImageUrl = s.ImageUrl,
                Order = s.Order
            }).ToList();
        }

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync(cancellationToken);

        return trip.Id;
    }
}
