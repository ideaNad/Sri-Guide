namespace SriGuide.Application.Agencies.DTOs;

public class AgencyTripDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? Reviews { get; set; }
    public double? Rating { get; set; }
    public string? Date { get; set; }
    public string? RawDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public List<string> Images { get; set; } = new();
    public string GuideName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsAgencyTour { get; set; }
}
