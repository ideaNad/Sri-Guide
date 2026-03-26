using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class TransportProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string BusinessName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? ProfileImageUrl { get; set; }
    
    public string? District { get; set; }
    public string? Province { get; set; }
    
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    public bool IsAvailable { get; set; } = true;

    public List<Vehicle> Vehicles { get; set; } = new();
}
