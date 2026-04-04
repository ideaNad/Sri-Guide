using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class FoodCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty; // Rice & Curry, Seafood, Street Food, Desserts, Beverages, etc.
    public string? ImageUrl { get; set; }
}
