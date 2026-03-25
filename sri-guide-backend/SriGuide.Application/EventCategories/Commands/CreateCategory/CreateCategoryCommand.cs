using MediatR;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.EventCategories.Commands.CreateCategory;

public record CreateCategoryCommand : IRequest<Guid>
{
    public string Name { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public List<CreateCategoryFieldDto> CustomFields { get; init; } = new();
}

public record CreateCategoryFieldDto
{
    public string FieldLabel { get; init; } = string.Empty;
    public string FieldName { get; init; } = string.Empty;
    public string FieldType { get; init; } = "text";
    public string? OptionsJson { get; init; }
    public bool IsRequired { get; init; }
    public int SortOrder { get; init; }
}

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new EventCategory
        {
            Name = request.Name,
            Icon = request.Icon,
            IsActive = true
        };

        foreach (var field in request.CustomFields)
        {
            category.CustomFields.Add(new EventCategoryField
            {
                FieldLabel = field.FieldLabel,
                FieldName = field.FieldName,
                FieldType = field.FieldType,
                OptionsJson = field.OptionsJson,
                IsRequired = field.IsRequired,
                SortOrder = field.SortOrder
            });
        }

        _context.EventCategories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
