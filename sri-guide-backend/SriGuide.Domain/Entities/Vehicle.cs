using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Vehicle : BaseEntity
{
    public Guid TransportProfileId { get; set; }
    public TransportProfile? TransportProfile { get; set; }

    public string VehicleType { get; set; } = string.Empty; // car, van, bus, tuk, jeep, bike
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public int PassengerCapacity { get; set; }
    public int LuggageCapacity { get; set; }
    public bool HasAc { get; set; }
    public string? VehicleImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool DriverIncluded { get; set; }

    public ICollection<VehicleReview> Reviews { get; set; } = new List<VehicleReview>();
    public ICollection<VehicleLike> Likes { get; set; } = new List<VehicleLike>();
}
