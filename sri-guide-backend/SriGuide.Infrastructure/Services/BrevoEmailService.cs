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

    public async Task SendPasswordResetEmailAsync(string email, string name, string token, DateTime expiryTime)
    {
        var apiKey = _configuration["BrevoSettings:ApiKey"];
        var templateId = _configuration.GetValue<int>("BrevoSettings:ForgotPasswordTemplateId");
        var resetLink = $"http://localhost:3000/reset-password?token={token}"; // TODO: Use dynamic base URL

        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_BREVO_API_KEY_HERE")
        {
            Console.WriteLine($"[EMAIL SIMULATION] To: {email}, TemplateId: {templateId}, Name: {name}, Token: {token}");
            return;
        }

        var payload = new
        {
            to = new[] { new { email = email } },
            templateId = templateId,
            @params = new
            {
                ResetLink = resetLink,
                Name = name,
                ExpiryTime = expiryTime.ToString("yyyy-MM-dd HH:mm:ss")
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Content = JsonContent.Create(payload);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
}
