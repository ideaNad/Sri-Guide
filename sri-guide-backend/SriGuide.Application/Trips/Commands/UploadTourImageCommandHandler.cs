using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using System.IO;

namespace SriGuide.Application.Trips.Commands;

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
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == request.TourId && t.AgencyId == request.AgencyId, cancellationToken);

        if (tour == null) throw new Exception("Tour not found or unauthorized");

        // Simple local storage mock for now, adjust if there's a real file service
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(request.File.FileName)}";
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "tours");
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
        
        var filePath = Path.Combine(uploadsFolder, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await request.File.CopyToAsync(stream);
        }

        var imageUrl = $"/uploads/tours/{fileName}";
        
        tour.Images.Add(new TourImage
        {
            ImageUrl = imageUrl,
            Caption = request.File.FileName
        });

        if (string.IsNullOrEmpty(tour.MainImageUrl))
        {
            tour.MainImageUrl = imageUrl;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return imageUrl;
    }
}
