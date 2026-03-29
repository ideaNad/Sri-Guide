using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class PopularPlace : BaseEntity, ISluggable
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? MapLink { get; set; }
    public int ViewCount { get; set; }
}
