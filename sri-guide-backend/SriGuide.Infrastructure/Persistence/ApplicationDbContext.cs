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
    public DbSet<ItineraryStep> ItinerarySteps => Set<ItineraryStep>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Configure User unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
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

        // Trip relationships
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Guide)
            .WithMany()
            .HasForeignKey(t => t.GuideId);

        modelBuilder.Entity<Trip>()
            .HasMany(t => t.Images)
            .WithOne(i => i.Trip)
            .HasForeignKey(i => i.TripId);

        modelBuilder.Entity<Trip>()
            .HasMany(t => t.Itinerary)
            .WithOne(i => i.Trip)
            .HasForeignKey(i => i.TripId);

        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Agency)
            .WithMany()
            .HasForeignKey(t => t.AgencyId)
            .OnDelete(DeleteBehavior.SetNull);

        // TripLike — unique per user per trip
        modelBuilder.Entity<TripLike>()
            .HasIndex(tl => new { tl.UserId, tl.TripId })
            .IsUnique();

        modelBuilder.Entity<TripLike>()
            .HasOne(tl => tl.Trip)
            .WithMany()
            .HasForeignKey(tl => tl.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TripLike>()
            .HasOne(tl => tl.User)
            .WithMany()
            .HasForeignKey(tl => tl.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
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

        return base.SaveChangesAsync(cancellationToken);
    }
}
