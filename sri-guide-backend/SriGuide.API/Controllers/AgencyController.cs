using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Application.Agencies.Queries;
using SriGuide.Domain.Enums;
using System.Security.Claims;

namespace SriGuide.API.Controllers;

[Authorize(Roles = "TravelAgency")]
[ApiController]
[Route("api/[controller]")]
public class AgencyController : ControllerBase
{
    private readonly IMediator _mediator;

    public AgencyController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AgencyDashboardDto>> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyDashboardQuery(Guid.Parse(userId)));
    }

    [HttpGet("guides")]
    public async Task<ActionResult<List<AgencyGuideDto>>> GetGuides()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyGuidesQuery(Guid.Parse(userId)));
    }

    [HttpGet("trips")]
    public async Task<ActionResult<List<AgencyTripDto>>> GetTrips()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyTripsQuery(Guid.Parse(userId)));
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<List<AgencyBookingDto>>> GetBookings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return await _mediator.Send(new GetAgencyBookingsQuery(Guid.Parse(userId)));
    }
}
