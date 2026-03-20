namespace SriGuide.Application.Profiles.DTOs;

public record PlanDto(
    Guid Id,
    string GuideName,
    string? GuideImage,
    DateTime BookingDate,
    string Status,
    decimal TotalAmount
);
