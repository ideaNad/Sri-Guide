namespace SriGuide.Application.Places.DTOs;

public record PopularPlaceDto(
    Guid Id, 
    string Title, 
    string? Slug,
    string Description, 
    string ImageUrl,
    string? MapLink,
    int ViewCount,
    DateTime CreatedAt
);
