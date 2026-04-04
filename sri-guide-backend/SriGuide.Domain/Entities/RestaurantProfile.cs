using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class RestaurantProfile : BaseEntity, ISluggable
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }

    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Email { get; set; }

    public string? CoverImage { get; set; }
    public string? Logo { get; set; }

    public string? Address { get; set; }
    public string? District { get; set; }
    public string? Province { get; set; }

    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? MapUrl { get; set; }

    public string? OpeningTime { get; set; }
    public string? ClosingTime { get; set; }

    public string? PriceRange { get; set; } // $, $$, $$$

    public List<string>? CuisineTypes { get; set; } = new();

    public bool IsVerified { get; set; }
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.None;
    public bool IsActive { get; set; } = true;

    // Advanced Features
    public List<string>? LanguagesSpoken { get; set; } = new();
    public List<string>? MenuLanguages { get; set; } = new();
    public List<string>? DietaryOptions { get; set; } = new(); // Vegetarian, Vegan, Halal, Gluten-Free
    public List<string>? Facilities { get; set; } = new(); // Parking, WiFi, AC, Outdoor Seating
    public List<string>? PaymentMethods { get; set; } = new(); // Cash, Card, Foreign Currency

    public bool FamilyFriendly { get; set; }
    public bool RomanticSetting { get; set; }
    public bool GroupFriendly { get; set; }

    public string? FacebookLink { get; set; }
    public string? InstagramLink { get; set; }
    public string? TikTokLink { get; set; }
    public string? YouTubeLink { get; set; }
    public string? TwitterLink { get; set; }
    public string? LinkedinLink { get; set; }
    public string? Website { get; set; }

    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
    public ICollection<RestaurantEvent> Events { get; set; } = new List<RestaurantEvent>();
    public ICollection<RestaurantReview> Reviews { get; set; } = new List<RestaurantReview>();
    public ICollection<RestaurantLike> Likes { get; set; } = new List<RestaurantLike>();
}
