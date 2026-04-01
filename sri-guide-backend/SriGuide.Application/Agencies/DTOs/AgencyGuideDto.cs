namespace SriGuide.Application.Agencies.DTOs;

public class AgencyGuideDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public double Rating { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int TripCount { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? Slug { get; set; }
    public bool IsOwner { get; set; }
}
