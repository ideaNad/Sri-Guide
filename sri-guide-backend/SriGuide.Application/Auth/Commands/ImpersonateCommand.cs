using MediatR;
using SriGuide.Application.Auth.DTOs;

namespace SriGuide.Application.Auth.Commands;

public record ImpersonateCommand(Guid TargetUserId) : IRequest<AuthResponse>;
