using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Infrastructure.Services;

public class BrevoEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public BrevoEmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var apiKey = _configuration["BrevoSettings:ApiKey"];
        var senderEmail = _configuration["BrevoSettings:SenderEmail"];
        var senderName = _configuration["BrevoSettings:SenderName"];

        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_BREVO_API_KEY_HERE")
        {
            // Placeholder/Development mode: just log or skip
            Console.WriteLine($"[EMAIL SIMULATION] To: {to}, Subject: {subject}, Body: {body}");
            return;
        }

        var payload = new
        {
            sender = new { name = senderName, email = senderEmail },
            to = new[] { new { email = to } },
            subject = subject,
            htmlContent = body
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Content = JsonContent.Create(payload);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task SendPasswordResetEmailAsync(string email, string token)
    {
        var resetLink = $"http://localhost:3000/reset-password?token={token}"; // TODO: Use dynamic base URL
        var subject = "Reset Your SRIGuide Password";
        var body = $@"
            <div style='font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <h2 style='color: #7367F0;'>SRIGuide Password Reset</h2>
                <p>You requested a password reset. Click the button below to set a new password:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{resetLink}' style='background-color: #7367F0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;'>Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style='word-break: break-all; color: #7367F0;'>{resetLink}</p>
                <p>This link will expire in 1 hour.</p>
                <hr style='border: none; border-top: 1px solid #eee;' />
                <p style='font-size: 12px; color: #999;'>If you didn't request this, you can safely ignore this email.</p>
            </div>";

        await SendEmailAsync(email, subject, body);
    }
}
