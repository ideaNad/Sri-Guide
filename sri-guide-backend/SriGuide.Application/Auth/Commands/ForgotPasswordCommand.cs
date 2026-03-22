using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Auth.Commands;

public record ForgotPasswordCommand(string Email) : IRequest;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public ForgotPasswordCommandHandler(IApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user == null)
        {
            // For security reasons, don't reveal that the user doesn't exist
            return;
        }

        // Generate a secure token
        var token = Guid.NewGuid().ToString("N");
        user.PasswordResetToken = token;
        user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);

        await _context.SaveChangesAsync(cancellationToken);

        // Send the email
        await _emailService.SendPasswordResetEmailAsync(
            user.Email, 
            user.FullName, 
            token, 
            user.ResetTokenExpires.Value
        );
    }
}
