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
        Guid? agencyProfileId = null;
        List<Guid?> guideUserIds = new List<Guid?>();

        if (request.AgencyId.HasValue)
        {
            var agency = await _context.AgencyProfiles
                .Include(a => a.Guides)
                .FirstOrDefaultAsync(a => a.UserId == request.AgencyId.Value, cancellationToken);
            if (agency == null) throw new Exception("Agency profile not found for this user");
            agencyProfileId = agency.Id;
            guideUserIds = agency.Guides.Select(g => (Guid?)g.UserId).ToList();
        }

        var trip = await _context.Trips
            .Include(t => t.Itinerary)
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == request.TripId && (t.AgencyId == agencyProfileId || (t.GuideId.HasValue && guideUserIds.Contains(t.GuideId.Value)) || t.GuideId == request.AgencyId), cancellationToken);

        if (trip == null) return false;

        trip.Title = request.Title ?? trip.Title;
        trip.Description = request.Description ?? trip.Description;
        trip.Location = request.Location ?? trip.Location;
        trip.Category = request.Category ?? trip.Category;
        trip.Duration = request.Duration;
        trip.MapLink = request.MapLink;
        trip.IsActive = request.IsActive;
        trip.Price = request.Price;
        trip.GuideId = request.GuideId; // Nullable
        trip.Date = request.Date.HasValue ? DateTime.SpecifyKind(request.Date.Value, DateTimeKind.Utc) : null;

        // Update Itinerary
        _context.ItinerarySteps.RemoveRange(trip.Itinerary);
        if (request.Itinerary != null)
        {
            trip.Itinerary = request.Itinerary.Select(s => new ItineraryStep
            {
                Time = s.Time,
                Title = s.Title,
                Description = s.Description,
                ImageUrl = s.ImageUrl,
                DayNumber = s.DayNumber,
                Order = s.Order
            }).ToList();
        }

        // Update Images
        // 1. Remove non-main-view images to refresh gallery
        var galleryImagesToRemove = trip.Images.Where(i => i.Caption != "Main View").ToList();
        foreach (var img in galleryImagesToRemove)
        {
            trip.Images.Remove(img);
        }

        // 2. Update or Add Main View Image
        if (!string.IsNullOrEmpty(request.MainImageUrl))
        {
            var mainImage = trip.Images.FirstOrDefault(i => i.Caption == "Main View");
            if (mainImage != null)
            {
                mainImage.ImageUrl = request.MainImageUrl;
            }
            else
            {
                trip.Images.Add(new TripImage
                {
                    ImageUrl = request.MainImageUrl,
                    Caption = "Main View"
                });
            }
        }

        // 3. Add Additional Images from request
        if (request.AdditionalImages != null)
        {
            foreach (var imgUrl in request.AdditionalImages)
            {
                if (!string.IsNullOrEmpty(imgUrl))
                {
                    trip.Images.Add(new TripImage
                    {
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
