using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Auth.DTOs;
using SriGuide.Application.Common.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace SriGuide.Application.Auth.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user == null || !BC.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse(token, user.Id, user.FullName, user.Email, user.Role);
    }
}
