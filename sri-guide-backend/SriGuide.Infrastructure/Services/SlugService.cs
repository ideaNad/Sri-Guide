using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Helpers;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Common;
using SriGuide.Infrastructure.Persistence;

namespace SriGuide.Infrastructure.Services;

public class SlugService : ISlugService
{
    private readonly ApplicationDbContext _context;

    public SlugService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> CreateUniqueSlugAsync<TEntity>(string baseText, Guid? excludeId = null, CancellationToken cancellationToken = default) 
        where TEntity : BaseEntity, ISluggable
    {
        var slug = SlugHelper.GenerateSlug(baseText);
        var baseSlug = slug;
        var count = 1;

        // Loop until a unique slug is found
        while (await _context.Set<TEntity>().AnyAsync(e => e.Slug == slug && (excludeId == null || e.Id != excludeId), cancellationToken))
        {
            slug = $"{baseSlug}-{count++}";
        }

        return slug;
    }
}
