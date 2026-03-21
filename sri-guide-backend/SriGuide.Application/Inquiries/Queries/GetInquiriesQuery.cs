using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.Inquiries.Queries;

public record InquiryDto(
    Guid Id,
    string FullName,
    string Email,
    string Subject,
    string Message,
    DateTime CreatedAt
);

public record GetInquiriesQuery : IRequest<List<InquiryDto>>;

public class GetInquiriesQueryHandler : IRequestHandler<GetInquiriesQuery, List<InquiryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetInquiriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<InquiryDto>> Handle(GetInquiriesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Inquiries
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new InquiryDto(
                i.Id,
                i.FullName,
                i.Email,
                i.Subject,
                i.Message,
                i.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
