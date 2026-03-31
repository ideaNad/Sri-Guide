using MediatR;
using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;

namespace SriGuide.Application.EventCategories.Commands.DeleteCategory;

public record DeleteCategoryCommand(Guid Id) : IRequest<bool>;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.EventCategories
            .Include(c => c.CustomFields)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null) return false;

        if (category.Events.Any())
        {
            throw new Exception("Cannot delete category that has associated events.");
        }

        // Remove association for fields (actually delete them)
        _context.EventCategoryFields.RemoveRange(category.CustomFields);
        _context.EventCategories.Remove(category);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
