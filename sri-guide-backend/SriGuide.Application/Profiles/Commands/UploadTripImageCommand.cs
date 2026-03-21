using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using System.IO;

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
        var trip = await _context.Trips
            .FirstOrDefaultAsync(t => t.Id == request.TripId && 
                (request.GuideId != null ? t.GuideId == request.GuideId : t.AgencyId == request.AgencyId), 
                cancellationToken);

        if (trip == null)
            throw new Exception("Trip not found or unauthorized");

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
