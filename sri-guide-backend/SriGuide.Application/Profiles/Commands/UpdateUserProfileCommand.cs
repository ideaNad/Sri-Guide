using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Profiles.Commands;

public record UpdateUserProfileCommand(
    Guid UserId,
    string? FullName,
    string? ProfileImageUrl
) : IRequest<bool>;

public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
        if (user == null) return false;

        user.FullName = request.FullName ?? user.FullName;
        user.ProfileImageUrl = request.ProfileImageUrl ?? user.ProfileImageUrl;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
