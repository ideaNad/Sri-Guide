using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SriGuide.Application.Trips.Commands;

public class UpdateTourCommandHandler : IRequestHandler<UpdateTourCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateTourCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateTourCommand request, CancellationToken cancellationToken)
    {
        var tour = await _context.Tours
            .Include(t => t.Itinerary)
            .Include(t => t.Images)
            .Include(t => t.DayDescriptions)
            .FirstOrDefaultAsync(t => t.Id == request.TourId && t.AgencyId == request.AgencyId, cancellationToken);

        if (tour == null) return false;

        tour.Title = request.Title ?? tour.Title;
        tour.Description = request.Description ?? tour.Description;
        tour.Location = request.Location ?? tour.Location;
        tour.Category = request.Category ?? tour.Category;
        tour.Duration = request.Duration;
        tour.MapLink = request.MapLink;
        tour.IsActive = request.IsActive;
        tour.Price = request.Price;
        tour.MainImageUrl = request.MainImageUrl;

        // Update Itinerary
        var oldItinerary = await _context.TourItinerarySteps
            .Where(s => s.TourId == tour.Id)
            .ToListAsync(cancellationToken);
        _context.TourItinerarySteps.RemoveRange(oldItinerary);
        
        if (request.Itinerary != null)
        {
            foreach (var s in request.Itinerary)
            {
                _context.TourItinerarySteps.Add(new TourItineraryStep
                {
                    TourId = tour.Id,
                    Time = s.Time,
                    Title = s.Title,
                    Description = s.Description,
                    ImageUrl = s.ImageUrl,
                    DayNumber = s.DayNumber,
                    Order = s.Order
                });
            }
        }

        // Update Day Descriptions
        var oldDays = await _context.TourDays
            .Where(d => d.TourId == tour.Id)
            .ToListAsync(cancellationToken);
        _context.TourDays.RemoveRange(oldDays);

        if (request.DayDescriptions != null)
        {
            foreach (var d in request.DayDescriptions)
            {
                _context.TourDays.Add(new TourDay
                {
                    TourId = tour.Id,
                    DayNumber = d.DayNumber,
                    Description = d.Description,
                    ImageUrl = d.ImageUrl
                });
            }
        }

        // Update Images
        var oldImages = await _context.TourImages
            .Where(i => i.TourId == tour.Id)
            .ToListAsync(cancellationToken);
        _context.TourImages.RemoveRange(oldImages);

        if (request.AdditionalImages != null)
        {
            foreach (var imgUrl in request.AdditionalImages)
            {
                if (!string.IsNullOrEmpty(imgUrl))
                {
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = tour.Id,
                        ImageUrl = imgUrl,
                        Caption = "Gallery Image"
                    });
                }
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
