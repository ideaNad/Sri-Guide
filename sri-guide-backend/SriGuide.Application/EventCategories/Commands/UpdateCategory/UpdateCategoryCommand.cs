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
        // 1. Load with AsNoTracking to get a clean slate
        var category = await _context.EventCategories
            .Include(c => c.CustomFields)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null) return false;

        // 2. Synchronization Logic (Disconnected)
        bool isCategoryModified = false;
        if (category.Name != request.Name) { category.Name = request.Name; isCategoryModified = true; }
        if (category.Icon != request.Icon) { category.Icon = request.Icon; isCategoryModified = true; }
        if (category.IsActive != request.IsActive) { category.IsActive = request.IsActive; isCategoryModified = true; }

        var existingFields = category.CustomFields.ToList();
        var incomingFieldDtos = request.CustomFields;

        // Collect actions to perform after attachment
        var fieldsToUpdate = new List<EventCategoryField>();
        var fieldsToAdd = new List<EventCategoryField>();
        var fieldsToRemove = new List<EventCategoryField>();

        // Identify fields to remove
        var incomingIds = incomingFieldDtos.Where(f => f.Id.HasValue).Select(f => f.Id!.Value).ToList();
        fieldsToRemove.AddRange(existingFields.Where(f => !incomingIds.Contains(f.Id)));

        // Identify existing/new
        foreach (var fieldDto in incomingFieldDtos)
        {
            if (fieldDto.Id.HasValue)
            {
                var existingField = existingFields.FirstOrDefault(f => f.Id == fieldDto.Id.Value);
                if (existingField != null)
                {
                    bool isFieldChanged = false;
                    if (existingField.FieldLabel != fieldDto.FieldLabel) { existingField.FieldLabel = fieldDto.FieldLabel; isFieldChanged = true; }
                    if (existingField.FieldName != fieldDto.FieldName) { existingField.FieldName = fieldDto.FieldName; isFieldChanged = true; }
                    if (existingField.FieldType != fieldDto.FieldType) { existingField.FieldType = fieldDto.FieldType; isFieldChanged = true; }
                    if (existingField.OptionsJson != fieldDto.OptionsJson) { existingField.OptionsJson = fieldDto.OptionsJson; isFieldChanged = true; }
                    if (existingField.IsRequired != fieldDto.IsRequired) { existingField.IsRequired = fieldDto.IsRequired; isFieldChanged = true; }
                    if (existingField.SortOrder != fieldDto.SortOrder) { existingField.SortOrder = fieldDto.SortOrder; isFieldChanged = true; }

                    if (isFieldChanged) fieldsToUpdate.Add(existingField);
                }
            }
            else
            {
                fieldsToAdd.Add(new EventCategoryField
                {
                    CategoryId = category.Id,
                    FieldLabel = fieldDto.FieldLabel,
                    FieldName = fieldDto.FieldName,
                    FieldType = fieldDto.FieldType,
                    OptionsJson = fieldDto.OptionsJson,
                    IsRequired = fieldDto.IsRequired,
                    SortOrder = fieldDto.SortOrder
                });
            }
        }

        // 3. Manual Attachment and State Management
        _context.Entry(category).State = isCategoryModified ? EntityState.Modified : EntityState.Unchanged;

        foreach (var field in fieldsToUpdate)
        {
            _context.Entry(field).State = EntityState.Modified;
        }

        foreach (var field in fieldsToAdd)
        {
            _context.Entry(field).State = EntityState.Added;
        }

        foreach (var field in fieldsToRemove)
        {
            _context.Entry(field).State = EntityState.Deleted;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
