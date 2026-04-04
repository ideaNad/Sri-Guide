using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Restaurants;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IMediator _mediator;

    public RestaurantsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<RestaurantSummaryDto>>> GetRestaurants(
        [FromQuery] string? search, 
        [FromQuery] string? priceRange,
        [FromQuery] string? district,
        [FromQuery] string? cuisineType,
        [FromQuery] string? dietaryOption)
    {
        return await _mediator.Send(new GetRestaurantsQuery(search, priceRange, district, cuisineType, dietaryOption));
    }

    [HttpGet("top")]
    public async Task<ActionResult<List<RestaurantSummaryDto>>> GetTopRestaurants([FromQuery] int count = 3)
    {
        return await _mediator.Send(new GetTopRestaurantsQuery(count));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<RestaurantDetailDto>> GetRestaurantBySlug(string slug)
    {
        var result = await _mediator.Send(new GetRestaurantBySlugQuery(slug));
        
        if (result == null) return NotFound();
        
        return result;
    }

    [Authorize]
    [HttpPost("like/{id}")]
    public async Task<ActionResult<bool>> LikeRestaurant(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(new LikeRestaurantCommand(id, userId));
        return Ok(result);
    }

    [Authorize]
    [HttpGet("liked")]
    public async Task<ActionResult<List<RestaurantSummaryDto>>> GetLikedRestaurants()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        return await _mediator.Send(new GetLikedRestaurantsQuery(userId));
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpGet("my-profile")]
    public async Task<ActionResult<RestaurantDetailDto>> GetMyRestaurantProfile()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(new GetMyRestaurantProfileQuery(userId));
        
        if (result == null) return NotFound();
        
        return result;
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPut("profile")]
    public async Task<ActionResult<bool>> UpdateRestaurantProfile([FromBody] UpdateRestaurantProfileCommand command)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        // Ensure the userId in command matches the authenticated user
        if (command.UserId != userId)
        {
            return Forbid();
        }

        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPost("menus")]
    public async Task<ActionResult<Guid>> CreateMenu([FromBody] CreateMenuCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPut("menus")]
    public async Task<ActionResult<bool>> UpdateMenu([FromBody] UpdateMenuCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpDelete("menus/{id}")]
    public async Task<ActionResult<bool>> DeleteMenu(Guid id)
    {
        return await _mediator.Send(new DeleteMenuCommand(id));
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPost("items")]
    public async Task<ActionResult<Guid>> CreateMenuItem([FromBody] CreateMenuItemCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPut("items")]
    public async Task<ActionResult<bool>> UpdateMenuItem([FromBody] UpdateMenuItemCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpDelete("items/{id}")]
    public async Task<ActionResult<bool>> DeleteMenuItem(Guid id)
    {
        return await _mediator.Send(new DeleteMenuItemCommand(id));
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPost("events")]
    public async Task<ActionResult<Guid>> CreateEvent([FromBody] CreateRestaurantEventCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPut("events")]
    public async Task<ActionResult<bool>> UpdateEvent([FromBody] UpdateRestaurantEventCommand command)
    {
        return await _mediator.Send(command);
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpDelete("events/{id}")]
    public async Task<ActionResult<bool>> DeleteEvent(Guid id)
    {
        return await _mediator.Send(new DeleteRestaurantEventCommand(id));
    }

    [Authorize(Roles = "RestaurantOwner")]
    [HttpPatch("toggle-status")]
    public async Task<ActionResult<bool>> ToggleRestaurantStatus()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        return await _mediator.Send(new ToggleRestaurantStatusCommand(userId));
    }

    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<List<RestaurantReviewDto>>> GetRestaurantReviews(Guid id)
    {
        return await _mediator.Send(new GetRestaurantReviewsQuery(id));
    }
}
