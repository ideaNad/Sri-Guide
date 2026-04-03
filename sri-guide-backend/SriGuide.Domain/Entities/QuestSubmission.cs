using SriGuide.Domain.Common;
using SriGuide.Domain.Enums;

namespace SriGuide.Domain.Entities;

public class QuestSubmission : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid QuestId { get; set; }
    public Quest Quest { get; set; } = null!;
    
    public string PhotoProofUrl { get; set; } = string.Empty;
    public double? SubmissionLatitude { get; set; }
    public double? SubmissionLongitude { get; set; }
    
    public QuestSubmissionStatus Status { get; set; }
    public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
    public string? ReviewerNotes { get; set; }
    public int EarnedXP { get; set; }
}
