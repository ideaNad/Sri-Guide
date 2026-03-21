using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Inquiries.Commands;

public record CreateInquiryCommand(
    string FullName,
    string Email,
    string Subject,
    string Message
) : IRequest<Guid>;

public class CreateInquiryCommandHandler : IRequestHandler<CreateInquiryCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateInquiryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateInquiryCommand request, CancellationToken cancellationToken)
    {
        var inquiry = new Inquiry
        {
            FullName = request.FullName,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync(cancellationToken);

        return inquiry.Id;
    }
}
