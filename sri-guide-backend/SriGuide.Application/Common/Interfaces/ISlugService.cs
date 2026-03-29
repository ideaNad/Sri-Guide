using SriGuide.Domain.Common;

namespace SriGuide.Application.Common.Interfaces;

public interface ISlugService
{
    Task<string> CreateUniqueSlugAsync<TEntity>(string baseText, Guid? excludeId = null, CancellationToken cancellationToken = default) 
        where TEntity : BaseEntity, ISluggable;
}
