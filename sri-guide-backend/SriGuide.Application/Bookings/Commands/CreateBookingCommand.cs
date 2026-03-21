using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;
using SriGuide.Domain.Enums;

namespace SriGuide.Application.Bookings.Commands;

public record CreateBookingCommand : IRequest<Guid>
{
    public Guid TourId { get; init; }
    public Guid CustomerId { get; init; }
    public int Guests { get; init; }
    public DateTime BookingDate { get; init; }
    public string? Notes { get; init; }
}

public class CreateBookingCommandHandler : IRequestHandler<CreateBookingCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateBookingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
    {
        var tour = await _context.Tours
            .FindAsync(new object[] { request.TourId }, cancellationToken);

        if (tour == null)
            throw new Exception("Tour not found");

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            TourId = request.TourId,
            CustomerId = request.CustomerId,
            Guests = request.Guests,
            BookingDate = request.BookingDate,
            Status = BookingStatus.Pending,
            TotalAmount = tour.Price * request.Guests
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync(cancellationToken);

        return booking.Id;
    }
}
