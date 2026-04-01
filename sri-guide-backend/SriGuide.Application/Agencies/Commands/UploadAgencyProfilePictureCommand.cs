using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Agencies.Commands;

public record UploadAgencyProfilePictureCommand(Guid UserId, IFormFile File) : IRequest<string>;

public class UploadAgencyProfilePictureCommandHandler : IRequestHandler<UploadAgencyProfilePictureCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly string _uploadPath;

    public UploadAgencyProfilePictureCommandHandler(IApplicationDbContext context)
    {
        _context = context;
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "agencies");
        
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<string> Handle(UploadAgencyProfilePictureCommand request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);
            
        if (agency == null) throw new Exception("Agency profile not found");

        var fileExtension = Path.GetExtension(request.File.FileName);
        var fileName = $"{agency.Id}_{DateTime.UtcNow.Ticks}{fileExtension}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await request.File.CopyToAsync(stream, cancellationToken);
        }

        var relativePath = $"/uploads/agencies/{fileName}";
        agency.AgencyProfileImageUrl = relativePath;

        await _context.SaveChangesAsync(cancellationToken);

        return relativePath;
    }
}
