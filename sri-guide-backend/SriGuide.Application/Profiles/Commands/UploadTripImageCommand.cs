using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using System.IO;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Profiles.Commands;

public record UploadTripImageCommand(Guid TripId, Guid? GuideId, Guid? AgencyId, IFormFile File) : IRequest<string>;

public class UploadTripImageCommandHandler : IRequestHandler<UploadTripImageCommand, string>
{
    private readonly IApplicationDbContext _context;

    public UploadTripImageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(UploadTripImageCommand request, CancellationToken cancellationToken)
    {
        Trip? trip = null;
        if (request.AgencyId != null)
        {
            var agency = await _context.AgencyProfiles
                .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .FirstOrDefaultAsync(a => a.Id == request.AgencyId, cancellationToken);
            
            if (agency != null)
            {
                var guideUserIds = agency.Guides.Select(g => g.UserId).ToList();
                trip = await _context.Trips
                    .Include(t => t.Images)
                    .FirstOrDefaultAsync(t => t.Id == request.TripId && 
                        (t.AgencyId == agency.Id || guideUserIds.Contains(t.GuideId ?? Guid.Empty)), 
                        cancellationToken);
            }
        }
        else
        {
            trip = await _context.Trips
                .Include(t => t.Images)
                .FirstOrDefaultAsync(t => t.Id == request.TripId && t.GuideId == request.GuideId, 
                    cancellationToken);
        }

        if (trip == null)
            throw new Exception("Trip not found or unauthorized");

        if (trip.Images.Count >= 5)
            throw new Exception("Maximum of 5 photos allowed per trip");

        if (request.File.Length > 0)
        {
            var folderName = Path.Combine("wwwroot", "uploads", "trips");
            var dbPath = Path.Combine("uploads", "trips");

            if (!Directory.Exists(folderName))
            {
                Directory.CreateDirectory(folderName);
            }

            var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
            var fullPath = Path.Combine(folderName, fileName);
            var relativePath = $"/{dbPath}/{fileName}".Replace("\\", "/");

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream, cancellationToken);
            }

            var tripImage = new TripImage
            {
                TripId = trip.Id,
                ImageUrl = relativePath
            };

            _context.TripImages.Add(tripImage);
            await _context.SaveChangesAsync(cancellationToken);

            return relativePath;
        }

        throw new Exception("No file provided");
    }
}
