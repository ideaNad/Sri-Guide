using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
    DbSet<TripLike> TripLikes { get; }
    DbSet<Tour> Tours { get; }
    DbSet<TourImage> TourImages { get; }
    DbSet<TourItineraryStep> TourItinerarySteps { get; }
    DbSet<TourDay> TourDays { get; }
    DbSet<TourLike> TourLikes { get; }
    DbSet<Feedback> Feedbacks { get; }
    DbSet<Inquiry> Inquiries { get; }
    DbSet<PopularPlace> PopularPlaces { get; }
    
    DbSet<EventOrganizerProfile> EventOrganizerProfiles { get; }
    DbSet<EventCategory> EventCategories { get; }
    DbSet<EventCategoryField> EventCategoryFields { get; }
    DbSet<Event> Events { get; }
    DbSet<EventFieldValue> EventFieldValues { get; }
    DbSet<EventLike> EventLikes { get; }
    DbSet<EventReview> EventReviews { get; }
    DbSet<TransportProfile> TransportProfiles { get; }
    DbSet<Vehicle> Vehicles { get; }
    DbSet<VehicleLike> VehicleLikes { get; }
    DbSet<VehicleReview> VehicleReviews { get; }
    
    EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
