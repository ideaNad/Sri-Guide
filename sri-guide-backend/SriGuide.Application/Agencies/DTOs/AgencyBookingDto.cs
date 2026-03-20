namespace SriGuide.Application.Agencies.DTOs;

public class AgencyBookingDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string TourName { get; set; } = string.Empty;
    public int Guests { get; set; }
    public string DateRange { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
