namespace SriGuide.Application.Events.DTOs;

public class EventReviewDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string? UserProfileImageUrl { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? EventTitle { get; set; } // Useful for organizer dashboard
}
