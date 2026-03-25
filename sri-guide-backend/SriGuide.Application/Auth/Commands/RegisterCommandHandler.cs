using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Auth.DTOs;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;
using BC = BCrypt.Net.BCrypt;

namespace SriGuide.Application.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if email exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
        {
             throw new Exception("Email already exists");
        }

        // Validate password length
        if (request.Password.Length < 8)
        {
            throw new Exception("Password must be at least 8 characters long.");
        }

        // Rule: Registration cannot result in travel_agency
        if (request.Role == UserRole.TravelAgency)
        {
            throw new Exception("Registration for Travel Agency role is not allowed. Please register as a Guide and upgrade later.");
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BC.HashPassword(request.Password),
            Role = request.Role,
            IsVerified = false,
            Slug = SlugHelper.GenerateSlug(request.FullName)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // If Guide, create profile
        if (user.Role == UserRole.Guide)
        {
            var profile = new GuideProfile { UserId = user.Id };
            _context.GuideProfiles.Add(profile);
            await _context.SaveChangesAsync(cancellationToken);
            user.GuideProfile = profile;
        }
        else if (user.Role == UserRole.EventOrganizer)
        {
            var profile = new EventOrganizerProfile 
            { 
                UserId = user.Id,
                OrganizationName = user.FullName, // Default to full name
                IsVerified = false
            };
            _context.EventOrganizerProfiles.Add(profile);
            await _context.SaveChangesAsync(cancellationToken);
            user.EventOrganizerProfile = profile;
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse(token, user.Id, user.FullName, user.Email, user.Role, user.ProfileImageUrl, user.OnboardingCompleted);
    }
}
