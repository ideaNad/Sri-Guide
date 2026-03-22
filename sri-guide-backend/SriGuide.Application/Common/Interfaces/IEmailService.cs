namespace SriGuide.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendPasswordResetEmailAsync(string email, string name, string token, DateTime expiryTime);
}
