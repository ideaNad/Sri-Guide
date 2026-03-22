using MediatR;
using SriGuide.Application.Common.Helpers;
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
        var agency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.Id == request.AgencyId, cancellationToken);
        if (agency == null) throw new Exception("Agency profile not found");

        var tour = new Tour
        {
            Title = request.Title,
            Slug = SlugHelper.GenerateSlug(request.Title),
            Description = request.Description,
            Location = request.Location,
            Category = request.Category,
            Duration = request.Duration,
            MapLink = request.MapLink,
            Price = request.Price,
            MainImageUrl = request.MainImageUrl,
            AgencyId = agency.Id,
            IsActive = request.IsActive
        };

        if (request.AdditionalImages != null)
        {
            foreach (var imgUrl in request.AdditionalImages)
            {
                if (!string.IsNullOrEmpty(imgUrl))
                {
                    tour.Images.Add(new TourImage
                    {
                        ImageUrl = imgUrl,
                        Caption = "Gallery Image"
                    });
                }
            }
        }

        if (request.Itinerary != null)
        {
            tour.Itinerary = request.Itinerary.Select(s => new TourItineraryStep
            {
                Time = s.Time,
                Title = s.Title,
                Description = s.Description,
                ImageUrl = s.ImageUrl,
                DayNumber = s.DayNumber,
                Order = s.Order
            }).ToList();
        }

        if (request.DayDescriptions != null)
        {
            tour.DayDescriptions = request.DayDescriptions.Select(d => new TourDay
            {
                DayNumber = d.DayNumber,
                Description = d.Description,
                ImageUrl = d.ImageUrl
            }).ToList();
        }

        _context.Tours.Add(tour);
        await _context.SaveChangesAsync(cancellationToken);

        return tour.Id;
    }
}
