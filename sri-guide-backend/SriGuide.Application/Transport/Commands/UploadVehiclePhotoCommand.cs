using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Transport.Commands;

public record UploadVehiclePhotoCommand(Guid VehicleId, Guid UserId, IFormFile File) : IRequest<string>;

public class UploadVehiclePhotoCommandHandler : IRequestHandler<UploadVehiclePhotoCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly string _uploadPath;

    public UploadVehiclePhotoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "vehicles");
        
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<string> Handle(UploadVehiclePhotoCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.TransportProfile)
            .FirstOrDefaultAsync(v => v.Id == request.VehicleId && v.TransportProfile.UserId == request.UserId, cancellationToken);
            
        if (vehicle == null) throw new Exception("Vehicle not found or unauthorized");

        var fileExtension = Path.GetExtension(request.File.FileName);
        var fileName = $"{vehicle.Id}_{DateTime.UtcNow.Ticks}{fileExtension}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await request.File.CopyToAsync(stream, cancellationToken);
        }

        var relativePath = $"/uploads/vehicles/{fileName}";
        vehicle.VehicleImageUrl = relativePath;

        await _context.SaveChangesAsync(cancellationToken);

        return relativePath;
    }
}
