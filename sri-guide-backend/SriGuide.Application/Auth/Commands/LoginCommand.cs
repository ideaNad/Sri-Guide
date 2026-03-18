using MediatR;
using SriGuide.Application.Auth.DTOs;

namespace SriGuide.Application.Auth.Commands;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResponse>;
