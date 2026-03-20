using Microsoft.EntityFrameworkCore;
using SriGuide.Infrastructure.Persistence;
using SriGuide.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Database=sriguide;Username=postgres;Password=postgres");

        using var context = new ApplicationDbContext(optionsBuilder.Options, null);

        var userId = Guid.Parse("dc355df9-a1c1-4f50-9117-ebd9ba6d4cf8");
        var tripId = Guid.Parse("66106103-7a18-4f44-8f5d-3bf4c1e132ee");

        var agency = await context.AgencyProfiles.FirstOrDefaultAsync(a => a.UserId == userId);
        var trip = await context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

        if (agency == null)
        {
            Console.WriteLine("AgencyProfile NOT FOUND for UserId: " + userId);
        }
        else
        {
            Console.WriteLine($"AgencyProfile FOUND: Id={agency.Id}, UserId={agency.UserId}");
        }

        if (trip == null)
        {
            Console.WriteLine("Trip NOT FOUND for TripId: " + tripId);
        }
        else
        {
            Console.WriteLine($"Trip FOUND: Id={trip.Id}, AgencyId={trip.AgencyId}");
            if (agency != null)
            {
                if (trip.AgencyId == agency.Id)
                {
                    Console.WriteLine("Ownership MATCHES!");
                }
                else
                {
                    Console.WriteLine("Ownership MISMATCH! Trip.AgencyId != AgencyProfile.Id");
                }
            }
        }
    }
}
