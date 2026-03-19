using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class Booking : BaseEntity
{
    public Guid GuideId { get; set; }
    public User? Guide { get; set; }

    public Guid CustomerId { get; set; }
    public User? Customer { get; set; }

    public DateTime BookingDate { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }
}
