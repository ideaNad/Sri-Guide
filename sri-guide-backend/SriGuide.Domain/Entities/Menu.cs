using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Menu : BaseEntity
{
    public Guid RestaurantProfileId { get; set; }
    public RestaurantProfile? RestaurantProfile { get; set; }

    public string Name { get; set; } = string.Empty; // e.g. Breakfast, Lunch, Dinner, Drinks
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
    public int Order { get; set; }

    public ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
}
