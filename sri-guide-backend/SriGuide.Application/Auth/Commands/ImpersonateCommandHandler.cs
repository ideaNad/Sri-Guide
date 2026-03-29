using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Auth.DTOs;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Auth.Commands;

public class ImpersonateCommandHandler : IRequestHandler<ImpersonateCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public ImpersonateCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(ImpersonateCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.AgencyProfile)
            .Include(u => u.GuideProfile)
            .Include(u => u.TransportProfile)
            .Include(u => u.EventOrganizerProfile)
            .FirstOrDefaultAsync(u => u.Id == request.TargetUserId, cancellationToken);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        // Generate token with isImpersonated = true
        var token = _jwtService.GenerateToken(user, isImpersonated: true);

        return new AuthResponse(
            token, 
            user.Id, 
            user.FullName, 
            user.Email, 
            user.Role, 
            user.ProfileImageUrl, 
            user.OnboardingCompleted
        );
    }
}
