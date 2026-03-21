using SriGuide.Domain.Common;

namespace SriGuide.Domain.Entities;

public class Feedback : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsReviewed { get; set; } = false;
}
