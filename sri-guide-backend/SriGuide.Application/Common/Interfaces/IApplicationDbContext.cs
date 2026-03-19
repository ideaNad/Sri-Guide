using Microsoft.EntityFrameworkCore;
using SriGuide.Domain.Entities;

namespace SriGuide.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<GuideProfile> GuideProfiles { get; }
    DbSet<AgencyProfile> AgencyProfiles { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Booking> Bookings { get; }
    DbSet<Trip> Trips { get; }
    DbSet<TripImage> TripImages { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
