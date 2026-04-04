using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class MenuItem : BaseEntity
{
    public Guid MenuId { get; set; }
    public Menu? Menu { get; set; }

    public Guid? FoodCategoryId { get; set; }
    public FoodCategory? FoodCategory { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public double? Price { get; set; } // Nullable, if null we can display "Contact for Price" or "Market Price"
    public string? Currency { get; set; } = "LKR";

    public string? Image { get; set; }

    public bool IsAvailable { get; set; } = true;
    public bool IsFeatured { get; set; } // True = "Tourist Recommended Dish" / "Must Try"

    public int? PrepTimeMinutes { get; set; }

    public string? SpiceLevel { get; set; } // Mild, Medium, Hot
    public string? PortionSize { get; set; } // Small, Medium, Large
    
    public int? Calories { get; set; }
    public string? IngredientsList { get; set; } // CSV or detailed text
    public string? AllergenInfo { get; set; } // CSV or detailed text
}
