using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Agencies.DTOs;
using SriGuide.Domain.Enums;
using System.Linq;

namespace SriGuide.Application.Agencies.Queries;

public record GetAgencyBookingsQuery(Guid UserId) : IRequest<List<AgencyBookingDto>>;

public class GetAgencyBookingsQueryHandler : IRequestHandler<GetAgencyBookingsQuery, List<AgencyBookingDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAgencyBookingsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AgencyBookingDto>> Handle(GetAgencyBookingsQuery request, CancellationToken cancellationToken)
    {
        var agency = await _context.AgencyProfiles
            .Include(a => a.Guides.Where(g => g.AgencyRecruitmentStatus == RecruitmentStatus.Accepted))
                .ThenInclude(g => g.Trips)
                    .ThenInclude(t => t.Bookings)
                        .ThenInclude(b => b.Customer)
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyBookingDto>();

        var bookings = agency.Guides.SelectMany(g => g.Trips).SelectMany(t => t.Bookings).ToList();

        return bookings.Select(b => new AgencyBookingDto
        {
            Id = b.Id,
            CustomerName = b.Customer?.FullName ?? "Unknown",
            TourName = b.Trip?.Title ?? "Unknown Tour",
            Guests = 1, // NumberOfGuests field missing in Domain, keeping placeholder but ready for future
            DateRange = b.BookingDate.ToString("MMM dd, yyyy"),
            Status = b.Status.ToString()
        }).ToList();
    }
}
