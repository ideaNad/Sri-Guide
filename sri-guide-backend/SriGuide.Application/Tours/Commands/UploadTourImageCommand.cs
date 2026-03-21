using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using System.IO;

namespace SriGuide.Application.Tours.Commands;

public record UploadTourImageCommand(Guid TourId, Guid AgencyId, IFormFile File) : IRequest<string>;

public class UploadTourImageCommandHandler : IRequestHandler<UploadTourImageCommand, string>
{
    private readonly IApplicationDbContext _context;

    public UploadTourImageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(UploadTourImageCommand request, CancellationToken cancellationToken)
    {
        var tour = await _context.Tours
            .FirstOrDefaultAsync(t => t.Id == request.TourId && t.AgencyId == request.AgencyId, cancellationToken);

        if (tour == null)
            throw new Exception("Tour not found or unauthorized");

        if (request.File.Length > 0)
        {
            var folderName = Path.Combine("wwwroot", "uploads", "tours");
            var dbPath = Path.Combine("uploads", "tours");

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

            var tourImage = new TourImage
            {
                TourId = tour.Id,
                ImageUrl = relativePath,
                Caption = "Gallery Image"
            };

            _context.TourImages.Add(tourImage);
            await _context.SaveChangesAsync(cancellationToken);

            return relativePath;
        }

        throw new Exception("No file provided");
    }
}
