using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Profiles.Commands;

public record UpdateUserProfileCommand(
    Guid UserId,
    string? FullName = null,
    string? ProfileImageUrl = null,
    bool? OnboardingCompleted = null,
    string? Interests = null,
    string? Budget = null,
    string? TravelDuration = null,
    string? PreferredLocation = null
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

        if (request.FullName != null)
        {
            user.FullName = request.FullName;
            user.Slug = SlugHelper.GenerateSlug(request.FullName);
        }
        
        user.ProfileImageUrl = request.ProfileImageUrl ?? user.ProfileImageUrl;
        user.OnboardingCompleted = request.OnboardingCompleted ?? user.OnboardingCompleted;
        user.Interests = request.Interests ?? user.Interests;
        user.Budget = request.Budget ?? user.Budget;
        user.TravelDuration = request.TravelDuration ?? user.TravelDuration;
        user.PreferredLocation = request.PreferredLocation ?? user.PreferredLocation;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
