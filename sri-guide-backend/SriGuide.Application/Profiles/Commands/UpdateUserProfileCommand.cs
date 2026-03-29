using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

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
    private readonly ISlugService _slugService;

    public UpdateUserProfileCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<bool> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
        if (user == null) return false;

        if (request.FullName != null)
        {
            user.FullName = request.FullName;
            user.Slug = await _slugService.CreateUniqueSlugAsync<User>(request.FullName, user.Id, cancellationToken);
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
