using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class VehicleLike : BaseEntity
{
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }
}
