using MediatR;
using SriGuide.Application.Auth.DTOs;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Auth.Commands;

public record RegisterCommand(
    string FullName,
    string Email,
    string Password,
    UserRole Role
) : IRequest<AuthResponse>;
