using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Profiles.Commands;

public record UploadProfilePictureCommand(Guid UserId, IFormFile File) : IRequest<string>;

public class UploadProfilePictureCommandHandler : IRequestHandler<UploadProfilePictureCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly string _uploadPath;

    public UploadProfilePictureCommandHandler(IApplicationDbContext context)
    {
        _context = context;
        // Ideally this should be in configuration
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
        
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<string> Handle(UploadProfilePictureCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            
        if (user == null) throw new Exception("User not found");

        var fileExtension = Path.GetExtension(request.File.FileName);
        var fileName = $"{user.Id}_{DateTime.UtcNow.Ticks}{fileExtension}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await request.File.CopyToAsync(stream, cancellationToken);
        }

        // Relative path for web access
        var relativePath = $"/uploads/profiles/{fileName}";
        user.ProfileImageUrl = relativePath;

        // Sync with TransportProfile if it exists
        var transportProfile = await _context.TransportProfiles
            .FirstOrDefaultAsync(t => t.UserId == user.Id, cancellationToken);
            
        if (transportProfile != null)
        {
            transportProfile.ProfileImageUrl = relativePath;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return relativePath;
    }
}
