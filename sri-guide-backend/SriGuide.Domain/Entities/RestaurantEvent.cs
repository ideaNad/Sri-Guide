using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class RestaurantEvent : BaseEntity
{
    public Guid RestaurantProfileId { get; set; }
    public RestaurantProfile? RestaurantProfile { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string? EventType { get; set; } // Live Music, DJ Night, Cultural Show, Special Dinner
    
    public DateTime? StartDateTime { get; set; }
    public DateTime? EndDateTime { get; set; }

    public string? Image { get; set; }

    public bool IsRecurring { get; set; }
    
    public bool TicketRequired { get; set; }
    public double? TicketPrice { get; set; }
    public string? Currency { get; set; } = "LKR";

    public string? PerformerName { get; set; }
    public string? MusicGenre { get; set; }
    public string? DressCode { get; set; }
    public bool ReservationRequired { get; set; }
}
