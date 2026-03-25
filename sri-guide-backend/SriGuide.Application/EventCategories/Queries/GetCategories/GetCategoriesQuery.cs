using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Application.EventCategories.DTOs;

namespace SriGuide.Application.EventCategories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<List<EventCategoryDto>>;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<EventCategoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCategoriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventCategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _context.EventCategories
            .Where(c => c.IsActive)
            .Include(c => c.CustomFields)
            .OrderBy(c => c.Name)
            .Select(c => new EventCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                IsActive = c.IsActive,
                CustomFields = c.CustomFields
                    .OrderBy(f => f.SortOrder)
                    .Select(f => new EventCategoryFieldDto
                    {
                        Id = f.Id,
                        FieldLabel = f.FieldLabel,
                        FieldName = f.FieldName,
                        FieldType = f.FieldType,
                        OptionsJson = f.OptionsJson,
                        IsRequired = f.IsRequired,
                        SortOrder = f.SortOrder
                    }).ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
