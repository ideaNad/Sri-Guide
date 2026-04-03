using Microsoft.EntityFrameworkCore;
using SriGuide.Application.Common.Interfaces;
using SriGuide.Domain.Common;
using SriGuide.Domain.Entities;

namespace SriGuide.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<GuideProfile> GuideProfiles => Set<GuideProfile>();
    public DbSet<AgencyProfile> AgencyProfiles => Set<AgencyProfile>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripImage> TripImages => Set<TripImage>();
    public DbSet<TripLike> TripLikes => Set<TripLike>();
    public DbSet<Tour> Tours => Set<Tour>();
    public DbSet<TourImage> TourImages => Set<TourImage>();
    public DbSet<TourItineraryStep> TourItinerarySteps => Set<TourItineraryStep>();
    public DbSet<TourDay> TourDays => Set<TourDay>();
    public DbSet<TourLike> TourLikes => Set<TourLike>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<PopularPlace> PopularPlaces => Set<PopularPlace>();

    public DbSet<EventOrganizerProfile> EventOrganizerProfiles => Set<EventOrganizerProfile>();
    public DbSet<EventCategory> EventCategories => Set<EventCategory>();
    public DbSet<EventCategoryField> EventCategoryFields => Set<EventCategoryField>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventFieldValue> EventFieldValues => Set<EventFieldValue>();
    public DbSet<EventLike> EventLikes => Set<EventLike>();
    public DbSet<EventReview> EventReviews => Set<EventReview>();

    public DbSet<TransportProfile> TransportProfiles => Set<TransportProfile>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleLike> VehicleLikes => Set<VehicleLike>();
    public DbSet<VehicleReview> VehicleReviews => Set<VehicleReview>();

    // Gamification
    public DbSet<Quest> Quests => Set<Quest>();
    public DbSet<QuestSubmission> QuestSubmissions => Set<QuestSubmission>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Gamification configurations
        modelBuilder.Entity<Quest>()
            .HasOne(q => q.RewardBadge)
            .WithMany()
            .HasForeignKey(q => q.RewardBadgeId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<QuestSubmission>()
            .HasOne(qs => qs.User)
            .WithMany(u => u.QuestSubmissions)
            .HasForeignKey(qs => qs.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuestSubmission>()
            .HasOne(qs => qs.Quest)
            .WithMany(q => q.Submissions)
            .HasForeignKey(qs => qs.QuestId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserBadge>()
            .HasOne(ub => ub.User)
            .WithMany(u => u.UserBadges)
            .HasForeignKey(ub => ub.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserBadge>()
            .HasOne(ub => ub.Badge)
            .WithMany(b => b.UserBadges)
            .HasForeignKey(ub => ub.BadgeId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);

        // Configure User unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Slug)
            .IsUnique();

        // GuideProfile relationships
        modelBuilder.Entity<GuideProfile>()
            .HasOne(g => g.User)
            .WithOne(u => u.GuideProfile)
            .HasForeignKey<GuideProfile>(g => g.UserId);

        modelBuilder.Entity<GuideProfile>()
            .HasOne(g => g.Agency)
            .WithMany(a => a.Guides)
            .HasForeignKey(g => g.AgencyId)
            .OnDelete(DeleteBehavior.SetNull);

        // AgencyProfile relationship
        modelBuilder.Entity<AgencyProfile>()
            .HasOne(a => a.User)
            .WithOne(u => u.AgencyProfile)
            .HasForeignKey<AgencyProfile>(a => a.UserId);

        modelBuilder.Entity<AgencyProfile>()
            .HasIndex(a => a.Slug)
            .IsUnique();

        // Review relationship
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId);

        // Booking relationships
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Guide)
            .WithMany()
            .HasForeignKey(b => b.GuideId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Customer)
            .WithMany()
            .HasForeignKey(b => b.CustomerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Tour)
            .WithMany(t => t.Bookings)
            .HasForeignKey(b => b.TourId)
            .OnDelete(DeleteBehavior.SetNull);

        // Trip relationships (Past Trips)
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Guide)
            .WithMany()
            .HasForeignKey(t => t.GuideId);

        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Agency)
            .WithMany()
            .HasForeignKey(t => t.AgencyId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Trip>()
            .HasMany(t => t.Images)
            .WithOne(i => i.Trip)
            .HasForeignKey(i => i.TripId);

        modelBuilder.Entity<Trip>()
            .HasIndex(t => t.Slug)
            .IsUnique();

        // TripLike — unique per user per trip
        modelBuilder.Entity<TripLike>()
            .HasIndex(tl => new { tl.UserId, tl.TripId })
            .IsUnique();

        modelBuilder.Entity<TripLike>()
            .HasOne(tl => tl.Trip)
            .WithMany(t => t.Likes)
            .HasForeignKey(tl => tl.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        // Tour relationships
        modelBuilder.Entity<Tour>()
            .HasOne(t => t.Agency)
            .WithMany()
            .HasForeignKey(t => t.AgencyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Tour>()
            .HasMany(t => t.Images)
            .WithOne(i => i.Tour)
            .HasForeignKey(i => i.TourId);

        modelBuilder.Entity<Tour>()
            .HasMany(t => t.Itinerary)
            .WithOne(i => i.Tour)
            .HasForeignKey(i => i.TourId);

        modelBuilder.Entity<Tour>()
            .HasMany(t => t.DayDescriptions)
            .WithOne(d => d.Tour)
            .HasForeignKey(d => d.TourId);

        modelBuilder.Entity<Tour>()
            .HasIndex(t => t.Slug)
            .IsUnique();

        // TourLike
        modelBuilder.Entity<TourLike>()
            .HasIndex(tl => new { tl.UserId, tl.TourId })
            .IsUnique();

        modelBuilder.Entity<TourLike>()
            .HasOne(tl => tl.Tour)
            .WithMany(t => t.Likes)
            .HasForeignKey(tl => tl.TourId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TourLike>()
            .HasOne(tl => tl.User)
            .WithMany()
            .HasForeignKey(tl => tl.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PopularPlace>()
            .Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        modelBuilder.Entity<PopularPlace>()
            .Property(p => p.Description)
            .IsRequired();

        modelBuilder.Entity<PopularPlace>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        // EventOrganizerProfile relationship
        modelBuilder.Entity<EventOrganizerProfile>()
            .HasOne(e => e.User)
            .WithOne(u => u.EventOrganizerProfile)
            .HasForeignKey<EventOrganizerProfile>(e => e.UserId);

        // EventCategory relationships
        modelBuilder.Entity<EventCategory>()
            .HasMany(c => c.CustomFields)
            .WithOne(f => f.Category)
            .HasForeignKey(f => f.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Category)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Event - Organizer relationship
        modelBuilder.Entity<Event>()
            .HasOne(e => e.OrganizerProfile)
            .WithMany(o => o.Events)
            .HasForeignKey(e => e.OrganizerProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // EventFieldValue relationships
        modelBuilder.Entity<EventFieldValue>()
            .HasOne(v => v.Event)
            .WithMany(e => e.FieldValues)
            .HasForeignKey(v => v.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EventFieldValue>()
            .HasOne(v => v.Field)
            .WithMany()
            .HasForeignKey(v => v.FieldId)
            .OnDelete(DeleteBehavior.Cascade);

        // EventLike
        modelBuilder.Entity<EventLike>()
            .HasIndex(el => new { el.UserId, el.EventId })
            .IsUnique();

        modelBuilder.Entity<EventLike>()
            .HasOne(el => el.Event)
            .WithMany()
            .HasForeignKey(el => el.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        // EventReview
        modelBuilder.Entity<EventReview>()
            .HasOne(er => er.Event)
            .WithMany()
            .HasForeignKey(er => er.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EventReview>()
            .HasOne(er => er.User)
            .WithMany()
            .HasForeignKey(er => er.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // TransportProfile relationship
        modelBuilder.Entity<TransportProfile>()
            .HasOne(t => t.User)
            .WithOne(u => u.TransportProfile)
            .HasForeignKey<TransportProfile>(t => t.UserId);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.TransportProfile)
            .WithMany(t => t.Vehicles)
            .HasForeignKey(v => v.TransportProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // VehicleLike
        modelBuilder.Entity<VehicleLike>()
            .HasIndex(vl => new { vl.UserId, vl.VehicleId })
            .IsUnique();

        modelBuilder.Entity<VehicleLike>()
            .HasOne(vl => vl.Vehicle)
            .WithMany(v => v.Likes)
            .HasForeignKey(vl => vl.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        // VehicleReview
        modelBuilder.Entity<VehicleReview>()
            .HasOne(vr => vr.Vehicle)
            .WithMany(v => v.Reviews)
            .HasForeignKey(vr => vr.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VehicleReview>()
            .HasOne(vr => vr.User)
            .WithMany()
            .HasForeignKey(vr => vr.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        try 
        {
            return await base.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            var details = string.Join("; ", ex.Entries.Select(e => $"{e.Entity.GetType().Name} [ID: {((BaseEntity)e.Entity).Id}] State: {e.State}"));
            throw new Exception($"Concurrency conflict detected on: {details}. The record may have been deleted or modified in the database since loading.", ex);
        }
    }
}
