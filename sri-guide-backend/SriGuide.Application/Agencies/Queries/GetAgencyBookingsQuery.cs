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
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (agency == null) return new List<AgencyBookingDto>();

        var bookings = await _context.Bookings
            .Include(b => b.Tour)
            .Include(b => b.Customer)
            .Where(b => b.Tour.AgencyId == agency.Id)
            .ToListAsync(cancellationToken);

        return bookings.Select(b => new AgencyBookingDto
        {
            Id = b.Id,
            CustomerName = b.Customer?.FullName ?? "Unknown",
            TourName = b.Tour?.Title ?? "Unknown Tour",
            Guests = 1, 
            DateRange = b.BookingDate.ToString("MMM dd, yyyy"),
            Status = b.Status.ToString()
        }).ToList();
    }
}
