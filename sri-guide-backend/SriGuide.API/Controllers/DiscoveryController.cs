using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Application.Discovery.Queries;
using SriGuide.Application.Trips.Queries;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiscoveryController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IApplicationDbContext _context;

    public DiscoveryController(IMediator mediator, IApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    [HttpGet("all-slugs")]
    public async Task<ActionResult<AllSlugsDto>> GetAllSlugs()
    {
        var result = await _mediator.Send(new GetAllSlugsQuery());
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? query, 
        [FromQuery] string? type,
        [FromQuery] List<string>? languages,
        [FromQuery] List<string>? specialties,
        [FromQuery] List<string>? areas,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] string? category = null,
        [FromQuery] string? location = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] decimal? minRating = null,
        [FromQuery] string? duration = null,
        [FromQuery] string? sortBy = null)
    {
        var result = await _mediator.Send(new GetDiscoveryQuery(
            query, 
            type, 
            languages, 
            specialties, 
            areas, 
            pageNumber, 
            pageSize, 
            category, 
            location,
            minPrice, 
            maxPrice, 
            minRating,
            duration, 
            sortBy));
        return Ok(result);
    }

    [HttpGet("recent-trips")]
    public async Task<IActionResult> GetRecentTrips()
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Guid? userIdObj = !string.IsNullOrEmpty(currentUserId) ? Guid.Parse(currentUserId) : null;

        var result = await _mediator.Send(new GetRecentTripsQuery(userIdObj));
        return Ok(result);
    }

    [HttpGet("popular-tours")]
    public async Task<IActionResult> GetPopularTours()
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Guid? userIdObj = !string.IsNullOrEmpty(currentUserId) ? Guid.Parse(currentUserId) : null;

        var result = await _mediator.Send(new GetPopularToursQuery(userIdObj));
        return Ok(result);
    }
}
