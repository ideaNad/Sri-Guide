using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Bookings.Commands;

public record UpdateBookingStatusCommand(Guid BookingId, BookingStatus Status) : IRequest<bool>;

public class UpdateBookingStatusCommandHandler : IRequestHandler<UpdateBookingStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateBookingStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateBookingStatusCommand request, CancellationToken cancellationToken)
    {
        var booking = await _context.Bookings.FindAsync(new object[] { request.BookingId }, cancellationToken);
        if (booking == null) return false;

        booking.Status = request.Status;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
