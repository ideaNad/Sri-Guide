using SriGuide.Domain.Entities;

namespace SriGuide.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, bool isImpersonated = false);
}
