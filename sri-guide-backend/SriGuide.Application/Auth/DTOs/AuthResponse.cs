using SriGuide.Domain.Enums;

namespace SriGuide.Application.Auth.DTOs;

public record AuthResponse(
    string Token,
    Guid Id,
    string FullName,
    string Email,
    UserRole Role
);
