using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.EventCategories.Commands.UpdateCategory;

public record UpdateCategoryCommand : IRequest<bool>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public bool IsActive { get; init; }
    public List<UpdateCategoryFieldDto> CustomFields { get; init; } = new();
}

public record UpdateCategoryFieldDto
{
    public Guid? Id { get; init; }
    public string FieldLabel { get; init; } = string.Empty;
    public string FieldName { get; init; } = string.Empty;
    public string FieldType { get; init; } = "text";
    public string? OptionsJson { get; init; }
    public bool IsRequired { get; init; }
    public int SortOrder { get; init; }
}

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.EventCategories
            .Include(c => c.CustomFields)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null) return false;

        category.Name = request.Name;
        category.Icon = request.Icon;
        category.IsActive = request.IsActive;

        // Simple approach: clear and re-add fields for now, or match by ID
        // For production, matching by ID is better to preserve existing data consistency
        
        // Remove fields not in the request
        var requestFieldIds = request.CustomFields.Where(f => f.Id.HasValue).Select(f => f.Id.Value).ToList();
        var fieldsToRemove = category.CustomFields.Where(f => !requestFieldIds.Contains(f.Id)).ToList();
        foreach (var field in fieldsToRemove)
        {
            category.CustomFields.Remove(field);
        }

        // Update existing or add new
        foreach (var fieldDto in request.CustomFields)
        {
            if (fieldDto.Id.HasValue)
            {
                var existingField = category.CustomFields.FirstOrDefault(f => f.Id == fieldDto.Id.Value);
                if (existingField != null)
                {
                    existingField.FieldLabel = fieldDto.FieldLabel;
                    existingField.FieldName = fieldDto.FieldName;
                    existingField.FieldType = fieldDto.FieldType;
                    existingField.OptionsJson = fieldDto.OptionsJson;
                    existingField.IsRequired = fieldDto.IsRequired;
                    existingField.SortOrder = fieldDto.SortOrder;
                }
            }
            else
            {
                category.CustomFields.Add(new EventCategoryField
                {
                    FieldLabel = fieldDto.FieldLabel,
                    FieldName = fieldDto.FieldName,
                    FieldType = fieldDto.FieldType,
                    OptionsJson = fieldDto.OptionsJson,
                    IsRequired = fieldDto.IsRequired,
                    SortOrder = fieldDto.SortOrder
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
