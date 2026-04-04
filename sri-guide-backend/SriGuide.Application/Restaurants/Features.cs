using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace SriGuide.Application.Restaurants;

public class RestaurantSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? CoverImage { get; set; }
    public string? Logo { get; set; }
    public string? Description { get; set; }
    public string? PriceRange { get; set; }
    public List<string> CuisineTypes { get; set; } = new();
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsVerified { get; set; }
}

public class RestaurantDetailDto : RestaurantSummaryDto
{
    public Guid UserId { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? District { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? MapUrl { get; set; }
    public string? OpeningTime { get; set; }
    public string? ClosingTime { get; set; }

    public string? FacebookLink { get; set; }
    public string? InstagramLink { get; set; }
    public string? TikTokLink { get; set; }
    public string? YouTubeLink { get; set; }
    public string? TwitterLink { get; set; }
    public string? LinkedinLink { get; set; }
    public string? Website { get; set; }

    public List<string> Facilities { get; set; } = new();
    public List<string> DietaryOptions { get; set; } = new();
    public List<string> PaymentMethods { get; set; } = new();

    public List<MenuDto> Menus { get; set; } = new();
    public List<RestaurantEventDto> Events { get; set; } = new();
}

public class MenuDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<MenuItemDto> Items { get; set; } = new();
}

public class MenuItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public double? Price { get; set; }
    public string? Currency { get; set; }
    public string? Image { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsFeatured { get; set; }
}

public class RestaurantEventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? EventType { get; set; }
    public DateTime? StartDateTime { get; set; }
    public string? Image { get; set; }
}

public class RestaurantReviewDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserProfileImageUrl { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

// 1. Get Top Restaurants
public record GetTopRestaurantsQuery(int Count = 3) : IRequest<List<RestaurantSummaryDto>>;

public class GetTopRestaurantsHandler : IRequestHandler<GetTopRestaurantsQuery, List<RestaurantSummaryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetTopRestaurantsHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<RestaurantSummaryDto>> Handle(GetTopRestaurantsQuery request, CancellationToken cancellationToken)
    {
        var restaurants = await _context.RestaurantProfiles
            .Where(r => r.IsActive)
            .Select(r => new RestaurantSummaryDto
            {
                Id = r.Id,
                Name = r.Name,
                Slug = r.Slug,
                CoverImage = r.CoverImage,
                Logo = r.Logo,
                Description = r.Description,
                PriceRange = r.PriceRange,
                CuisineTypes = r.CuisineTypes ?? new List<string>(),
                Rating = (double)(r.Reviews.Select(rev => (int?)rev.Rating).Average() ?? 0),
                ReviewCount = r.Reviews.Count,
                IsVerified = r.IsVerified
            })
            .OrderByDescending(x => x.Rating)
            .Take(request.Count)
            .ToListAsync(cancellationToken);

        return restaurants;
    }
}

// 2. Get All Restaurants (Search & Filter)
public record GetRestaurantsQuery(
    string? Search, 
    string? PriceRange, 
    string? District = null, 
    string? CuisineType = null,
    string? DietaryOption = null
) : IRequest<List<RestaurantSummaryDto>>;

public class GetRestaurantsHandler : IRequestHandler<GetRestaurantsQuery, List<RestaurantSummaryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRestaurantsHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<RestaurantSummaryDto>> Handle(GetRestaurantsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.RestaurantProfiles
            .Where(r => r.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(r => r.Name.Contains(request.Search) || (r.Description != null && r.Description.Contains(request.Search)));
        }

        if (!string.IsNullOrEmpty(request.PriceRange))
        {
            query = query.Where(r => r.PriceRange == request.PriceRange);
        }

        if (!string.IsNullOrEmpty(request.District))
        {
            query = query.Where(r => r.District == request.District);
        }

        if (!string.IsNullOrEmpty(request.CuisineType))
        {
            query = query.Where(r => r.CuisineTypes != null && r.CuisineTypes.Contains(request.CuisineType));
        }

        if (!string.IsNullOrEmpty(request.DietaryOption))
        {
            query = query.Where(r => r.DietaryOptions != null && r.DietaryOptions.Contains(request.DietaryOption));
        }

        return await query.Select(r => new RestaurantSummaryDto
        {
            Id = r.Id,
            Name = r.Name,
            Slug = r.Slug,
            CoverImage = r.CoverImage,
            Logo = r.Logo,
            Description = r.Description,
            PriceRange = r.PriceRange,
            CuisineTypes = r.CuisineTypes ?? new List<string>(),
            Rating = (double)(r.Reviews.Select(rev => (int?)rev.Rating).Average() ?? 0),
            ReviewCount = r.Reviews.Count,
            IsVerified = r.IsVerified
        })
        .ToListAsync(cancellationToken);
    }
}

// 3. Get Restaurant by Slug
public record GetRestaurantBySlugQuery(string Slug) : IRequest<RestaurantDetailDto?>;

public class GetRestaurantBySlugHandler : IRequestHandler<GetRestaurantBySlugQuery, RestaurantDetailDto?>
{
    private readonly IApplicationDbContext _context;

    public GetRestaurantBySlugHandler(IApplicationDbContext context) => _context = context;

    public async Task<RestaurantDetailDto?> Handle(GetRestaurantBySlugQuery request, CancellationToken cancellationToken)
    {
        var restaurant = await _context.RestaurantProfiles
            .Include(r => r.Menus).ThenInclude(m => m.Items)
            .Include(r => r.Events)
            .Include(r => r.Reviews)
            .FirstOrDefaultAsync(r => r.Slug == request.Slug && r.IsActive, cancellationToken);

        if (restaurant == null) return null;

        return new RestaurantDetailDto
        {
            Id = restaurant.Id,
            UserId = restaurant.UserId,
            Name = restaurant.Name,
            Slug = restaurant.Slug,
            CoverImage = restaurant.CoverImage,
            Logo = restaurant.Logo,
            Description = restaurant.Description,
            PriceRange = restaurant.PriceRange,
            CuisineTypes = restaurant.CuisineTypes ?? new List<string>(),
            IsVerified = restaurant.IsVerified,
            Phone = restaurant.Phone,
            WhatsApp = restaurant.WhatsApp,
            Email = restaurant.Email,
            Address = restaurant.Address,
            District = restaurant.District,
            Latitude = restaurant.Latitude,
            Longitude = restaurant.Longitude,
            MapUrl = restaurant.MapUrl,
            OpeningTime = restaurant.OpeningTime,
            ClosingTime = restaurant.ClosingTime,

            FacebookLink = restaurant.FacebookLink,
            InstagramLink = restaurant.InstagramLink,
            TikTokLink = restaurant.TikTokLink,
            YouTubeLink = restaurant.YouTubeLink,
            TwitterLink = restaurant.TwitterLink,
            LinkedinLink = restaurant.LinkedinLink,
            Website = restaurant.Website,

            Facilities = restaurant.Facilities ?? new List<string>(),
            DietaryOptions = restaurant.DietaryOptions ?? new List<string>(),
            PaymentMethods = restaurant.PaymentMethods ?? new List<string>(),
            ReviewCount = restaurant.Reviews.Count,
            Rating = (double)(restaurant.Reviews.Select(rev => (int?)rev.Rating).Average() ?? 0),
            Menus = restaurant.Menus.Where(m => m.IsActive).Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Items = m.Items.Where(i => i.IsAvailable).Select(i => new MenuItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Description = i.Description,
                    Price = i.Price,
                    Currency = i.Currency,
                    Image = i.Image,
                    IsAvailable = i.IsAvailable,
                    IsFeatured = i.IsFeatured
                }).ToList()
            }).ToList(),
            Events = restaurant.Events.Where(e => (e.StartDateTime == null || e.StartDateTime >= DateTime.UtcNow)).Select(e => new RestaurantEventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                EventType = e.EventType,
                StartDateTime = e.StartDateTime,
                Image = e.Image
            }).ToList()
        };
    }
}

// 4. Like / Favorite Restaurant
public record LikeRestaurantCommand(Guid RestaurantId, Guid UserId) : IRequest<bool>;

public class LikeRestaurantHandler : IRequestHandler<LikeRestaurantCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public LikeRestaurantHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(LikeRestaurantCommand request, CancellationToken cancellationToken)
    {
        var existingLike = await _context.RestaurantLikes
            .FirstOrDefaultAsync(l => l.RestaurantProfileId == request.RestaurantId && l.UserId == request.UserId, cancellationToken);

        if (existingLike != null)
        {
            _context.RestaurantLikes.Remove(existingLike); // Toggle: unlike
            await _context.SaveChangesAsync(cancellationToken);
            return false;
        }

        var newLike = new RestaurantLike
        {
            RestaurantProfileId = request.RestaurantId,
            UserId = request.UserId
        };

        _context.RestaurantLikes.Add(newLike);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 5. Get Liked Restaurants
public record GetLikedRestaurantsQuery(Guid UserId) : IRequest<List<RestaurantSummaryDto>>;

public class GetLikedRestaurantsHandler : IRequestHandler<GetLikedRestaurantsQuery, List<RestaurantSummaryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLikedRestaurantsHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<RestaurantSummaryDto>> Handle(GetLikedRestaurantsQuery request, CancellationToken cancellationToken)
    {
        var likedRestaurantIds = await _context.RestaurantLikes
            .Where(l => l.UserId == request.UserId)
            .Select(l => l.RestaurantProfileId)
            .ToListAsync(cancellationToken);

        var restaurants = await _context.RestaurantProfiles
            .Where(r => likedRestaurantIds.Contains(r.Id) && r.IsActive)
            .Select(r => new RestaurantSummaryDto
            {
                Id = r.Id,
                Name = r.Name,
                Slug = r.Slug,
                CoverImage = r.CoverImage,
                Logo = r.Logo,
                Description = r.Description,
                PriceRange = r.PriceRange,
                CuisineTypes = r.CuisineTypes ?? new List<string>(),
                Rating = (double)(r.Reviews.Select(rev => (int?)rev.Rating).Average() ?? 0),
                ReviewCount = r.Reviews.Count,
                IsVerified = r.IsVerified
            })
            .ToListAsync(cancellationToken);

        return restaurants;
    }
}

// 6. Get My Restaurant Profile (Owner)
public record GetMyRestaurantProfileQuery(Guid UserId) : IRequest<RestaurantDetailDto?>;

public class GetMyRestaurantProfileHandler : IRequestHandler<GetMyRestaurantProfileQuery, RestaurantDetailDto?>
{
    private readonly IApplicationDbContext _context;

    public GetMyRestaurantProfileHandler(IApplicationDbContext context) => _context = context;

    public async Task<RestaurantDetailDto?> Handle(GetMyRestaurantProfileQuery request, CancellationToken cancellationToken)
    {
        var restaurant = await _context.RestaurantProfiles
            .Include(r => r.Menus).ThenInclude(m => m.Items)
            .Include(r => r.Events)
            .Include(r => r.Reviews)
            .FirstOrDefaultAsync(r => r.UserId == request.UserId, cancellationToken);

        if (restaurant == null) return null;

        return new RestaurantDetailDto
        {
            Id = restaurant.Id,
            UserId = restaurant.UserId,
            Name = restaurant.Name,
            Slug = restaurant.Slug,
            CoverImage = restaurant.CoverImage,
            Logo = restaurant.Logo,
            Description = restaurant.Description,
            PriceRange = restaurant.PriceRange,
            CuisineTypes = restaurant.CuisineTypes ?? new List<string>(),
            IsVerified = restaurant.IsVerified,
            Phone = restaurant.Phone,
            WhatsApp = restaurant.WhatsApp,
            Email = restaurant.Email,
            Address = restaurant.Address,
            District = restaurant.District,
            Latitude = restaurant.Latitude,
            Longitude = restaurant.Longitude,
            MapUrl = restaurant.MapUrl,
            OpeningTime = restaurant.OpeningTime,
            ClosingTime = restaurant.ClosingTime,

            FacebookLink = restaurant.FacebookLink,
            InstagramLink = restaurant.InstagramLink,
            TikTokLink = restaurant.TikTokLink,
            YouTubeLink = restaurant.YouTubeLink,
            TwitterLink = restaurant.TwitterLink,
            LinkedinLink = restaurant.LinkedinLink,
            Website = restaurant.Website,

            Facilities = restaurant.Facilities ?? new List<string>(),
            DietaryOptions = restaurant.DietaryOptions ?? new List<string>(),
            PaymentMethods = restaurant.PaymentMethods ?? new List<string>(),
            ReviewCount = restaurant.Reviews.Count,
            Rating = (double)(restaurant.Reviews.Select(rev => (int?)rev.Rating).Average() ?? 0),
            Menus = restaurant.Menus.Where(m => m.IsActive).Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Items = m.Items.Where(i => i.IsAvailable).Select(i => new MenuItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Description = i.Description,
                    Price = i.Price,
                    Currency = i.Currency,
                    Image = i.Image,
                    IsAvailable = i.IsAvailable,
                    IsFeatured = i.IsFeatured
                }).ToList()
            }).ToList(),
            Events = restaurant.Events.Where(e => (e.StartDateTime == null || e.StartDateTime >= DateTime.UtcNow)).Select(e => new RestaurantEventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                EventType = e.EventType,
                StartDateTime = e.StartDateTime,
                Image = e.Image
            }).ToList()
        };
    }
}

// 7. Update Restaurant Profile
public record UpdateRestaurantProfileCommand(
    Guid UserId,
    string Name,
    string? Description,
    string? Phone,
    string? WhatsApp,
    string? Email,
    string? Address,
    string? District,
    string? Province,
    string? MapUrl,
    string? OpeningTime,
    string? ClosingTime,
    string? PriceRange,
    string? Logo,
    string? CoverImage,
    List<string>? CuisineTypes,
    List<string>? Facilities,
    List<string>? DietaryOptions,
    List<string>? PaymentMethods,
    bool FamilyFriendly,
    bool RomanticSetting,
    bool GroupFriendly,
    string? FacebookLink = null,
    string? InstagramLink = null,
    string? TikTokLink = null,
    string? YouTubeLink = null,
    string? TwitterLink = null,
    string? LinkedinLink = null,
    string? Website = null
) : IRequest<bool>;

public class UpdateRestaurantProfileHandler : IRequestHandler<UpdateRestaurantProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateRestaurantProfileHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateRestaurantProfileCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _context.RestaurantProfiles.FirstOrDefaultAsync(r => r.UserId == request.UserId, cancellationToken);
        
        if (restaurant == null) return false;

        restaurant.Name = request.Name;
        restaurant.Description = request.Description;
        restaurant.Phone = request.Phone;
        restaurant.WhatsApp = request.WhatsApp;
        restaurant.Email = request.Email;
        restaurant.Address = request.Address;
        restaurant.District = request.District;
        restaurant.Province = request.Province;
        restaurant.MapUrl = request.MapUrl;
        restaurant.OpeningTime = request.OpeningTime;
        restaurant.ClosingTime = request.ClosingTime;
        restaurant.PriceRange = request.PriceRange;
        restaurant.Logo = request.Logo;
        restaurant.CoverImage = request.CoverImage;
        restaurant.CuisineTypes = request.CuisineTypes;
        restaurant.Facilities = request.Facilities;
        restaurant.DietaryOptions = request.DietaryOptions;
        restaurant.PaymentMethods = request.PaymentMethods;
        restaurant.FamilyFriendly = request.FamilyFriendly;
        restaurant.RomanticSetting = request.RomanticSetting;
        restaurant.GroupFriendly = request.GroupFriendly;

        restaurant.FacebookLink = request.FacebookLink;
        restaurant.InstagramLink = request.InstagramLink;
        restaurant.TikTokLink = request.TikTokLink;
        restaurant.YouTubeLink = request.YouTubeLink;
        restaurant.TwitterLink = request.TwitterLink;
        restaurant.LinkedinLink = request.LinkedinLink;
        restaurant.Website = request.Website;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 8. Create Menu
public record CreateMenuCommand(Guid RestaurantProfileId, string Name, string? Description) : IRequest<Guid>;

public class CreateMenuHandler : IRequestHandler<CreateMenuCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateMenuHandler(IApplicationDbContext context) => _context = context;

    public async Task<Guid> Handle(CreateMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = new Menu
        {
            RestaurantProfileId = request.RestaurantProfileId,
            Name = request.Name,
            Description = request.Description,
            IsActive = true
        };

        _context.Menus.Add(menu);
        await _context.SaveChangesAsync(cancellationToken);
        return menu.Id;
    }
}

// 9. Update Menu
public record UpdateMenuCommand(Guid Id, string Name, string? Description, bool IsActive) : IRequest<bool>;

public class UpdateMenuHandler : IRequestHandler<UpdateMenuCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateMenuHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = await _context.Menus.FindAsync(request.Id);
        if (menu == null) return false;

        menu.Name = request.Name;
        menu.Description = request.Description;
        menu.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 10. Delete Menu
public record DeleteMenuCommand(Guid Id) : IRequest<bool>;

public class DeleteMenuHandler : IRequestHandler<DeleteMenuCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteMenuHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = await _context.Menus.FindAsync(request.Id);
        if (menu == null) return false;

        _context.Menus.Remove(menu);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 11. Create Menu Item
public record CreateMenuItemCommand(
    Guid MenuId,
    string Name,
    string? Description,
    double? Price,
    string? Currency,
    string? Image,
    bool IsAvailable,
    bool IsFeatured,
    string? SpiceLevel,
    string? PortionSize
) : IRequest<Guid>;

public class CreateMenuItemHandler : IRequestHandler<CreateMenuItemCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateMenuItemHandler(IApplicationDbContext context) => _context = context;

    public async Task<Guid> Handle(CreateMenuItemCommand request, CancellationToken cancellationToken)
    {
        var item = new MenuItem
        {
            MenuId = request.MenuId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Currency = request.Currency ?? "LKR",
            Image = request.Image,
            IsAvailable = request.IsAvailable,
            IsFeatured = request.IsFeatured,
            SpiceLevel = request.SpiceLevel,
            PortionSize = request.PortionSize
        };

        _context.MenuItems.Add(item);
        await _context.SaveChangesAsync(cancellationToken);
        return item.Id;
    }
}

// 12. Update Menu Item
public record UpdateMenuItemCommand(
    Guid Id,
    string Name,
    string? Description,
    double? Price,
    string? Currency,
    string? Image,
    bool IsAvailable,
    bool IsFeatured,
    string? SpiceLevel,
    string? PortionSize
) : IRequest<bool>;

public class UpdateMenuItemHandler : IRequestHandler<UpdateMenuItemCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateMenuItemHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateMenuItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _context.MenuItems.FindAsync(request.Id);
        if (item == null) return false;

        item.Name = request.Name;
        item.Description = request.Description;
        item.Price = request.Price;
        item.Currency = request.Currency ?? "LKR";
        item.Image = request.Image;
        item.IsAvailable = request.IsAvailable;
        item.IsFeatured = request.IsFeatured;
        item.SpiceLevel = request.SpiceLevel;
        item.PortionSize = request.PortionSize;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 13. Delete Menu Item
public record DeleteMenuItemCommand(Guid Id) : IRequest<bool>;

public class DeleteMenuItemHandler : IRequestHandler<DeleteMenuItemCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteMenuItemHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteMenuItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _context.MenuItems.FindAsync(request.Id);
        if (item == null) return false;

        _context.MenuItems.Remove(item);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 14. Create Restaurant Event
public record CreateRestaurantEventCommand(
    Guid RestaurantProfileId,
    string Title,
    string? Description,
    string? EventType,
    DateTime? StartDateTime,
    string? Image
) : IRequest<Guid>;

public class CreateRestaurantEventHandler : IRequestHandler<CreateRestaurantEventCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateRestaurantEventHandler(IApplicationDbContext context) => _context = context;

    public async Task<Guid> Handle(CreateRestaurantEventCommand request, CancellationToken cancellationToken)
    {
        var e = new RestaurantEvent
        {
            RestaurantProfileId = request.RestaurantProfileId,
            Title = request.Title,
            Description = request.Description,
            EventType = request.EventType,
            StartDateTime = request.StartDateTime,
            Image = request.Image
        };

        _context.RestaurantEvents.Add(e);
        await _context.SaveChangesAsync(cancellationToken);
        return e.Id;
    }
}

// 15. Update Restaurant Event
public record UpdateRestaurantEventCommand(
    Guid Id,
    string Title,
    string? Description,
    string? EventType,
    DateTime? StartDateTime,
    string? Image
) : IRequest<bool>;

public class UpdateRestaurantEventHandler : IRequestHandler<UpdateRestaurantEventCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateRestaurantEventHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateRestaurantEventCommand request, CancellationToken cancellationToken)
    {
        var e = await _context.RestaurantEvents.FindAsync(request.Id);
        if (e == null) return false;

        e.Title = request.Title;
        e.Description = request.Description;
        e.EventType = request.EventType;
        e.StartDateTime = request.StartDateTime;
        e.Image = request.Image;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 16. Delete Restaurant Event
public record DeleteRestaurantEventCommand(Guid Id) : IRequest<bool>;

public class DeleteRestaurantEventHandler : IRequestHandler<DeleteRestaurantEventCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteRestaurantEventHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteRestaurantEventCommand request, CancellationToken cancellationToken)
    {
        var e = await _context.RestaurantEvents.FindAsync(request.Id);
        if (e == null) return false;

        _context.RestaurantEvents.Remove(e);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// 17. Toggle Restaurant Status (Active/Inactive)
public record ToggleRestaurantStatusCommand(Guid UserId) : IRequest<bool>;

public class ToggleRestaurantStatusHandler : IRequestHandler<ToggleRestaurantStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleRestaurantStatusHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(ToggleRestaurantStatusCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _context.RestaurantProfiles.FirstOrDefaultAsync(r => r.UserId == request.UserId, cancellationToken);
        if (restaurant == null) return false;

        restaurant.IsActive = !restaurant.IsActive;
        await _context.SaveChangesAsync(cancellationToken);
        
        return restaurant.IsActive;
    }
}

// 18. Get Restaurant Reviews
public record GetRestaurantReviewsQuery(Guid RestaurantId) : IRequest<List<RestaurantReviewDto>>;

public class GetRestaurantReviewsHandler : IRequestHandler<GetRestaurantReviewsQuery, List<RestaurantReviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRestaurantReviewsHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<RestaurantReviewDto>> Handle(GetRestaurantReviewsQuery request, CancellationToken cancellationToken)
    {
        return await _context.RestaurantReviews
            .Include(r => r.User)
            .Where(r => r.RestaurantProfileId == request.RestaurantId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RestaurantReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User != null ? r.User.FullName : "Traveler",
                UserProfileImageUrl = r.User != null ? r.User.ProfileImageUrl : null,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
