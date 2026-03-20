using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.Profiles.DTOs;

namespace SriGuide.Application.Profiles.Queries;

public record GetMyPlansQuery(Guid UserId) : IRequest<List<PlanDto>>;

public class GetMyPlansQueryHandler : IRequestHandler<GetMyPlansQuery, List<PlanDto>>
{
    private readonly IApplicationDbContext _context;

    public GetMyPlansQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PlanDto>> Handle(GetMyPlansQuery request, CancellationToken cancellationToken)
    {
        var bookings = await _context.Bookings
            .Include(b => b.Guide)
            .Where(b => b.CustomerId == request.UserId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync(cancellationToken);

        return bookings.Select(b => new PlanDto(
            b.Id,
            b.Guide?.FullName ?? "Unknown Guide",
            b.Guide?.ProfileImageUrl,
            b.BookingDate,
            b.Status.ToString(),
            b.TotalAmount
        )).ToList();
    }
}
