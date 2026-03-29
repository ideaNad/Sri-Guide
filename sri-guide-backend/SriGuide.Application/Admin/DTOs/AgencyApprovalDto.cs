namespace SriGuide.Application.Admin.DTOs;

public record AgencyApprovalDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string CompanyName,
    string CompanyEmail,
    string RegistrationNumber,
    string Phone,
    string WhatsApp,
    string RegistrationDocUrl,
    DateTime CreatedAt
);
