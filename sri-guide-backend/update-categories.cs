using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SriGuide.Infrastructure.Persistence;

namespace SriGuide.API
{
    public class DataUpdateScript
    {
        public static async Task Main(string[] args)
        {
            var builder = Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    var connectionString = hostContext.Configuration.GetConnectionString("DefaultConnection");
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseNpgsql(connectionString));
                });

            var host = builder.Build();

            using (var scope = host.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var tour1 = await context.Tours.FirstOrDefaultAsync(t => t.Title.Contains("agency tour 01"));
                if (tour1 != null)
                {
                    tour1.Category = "Adventure, Culture";
                    Console.WriteLine($"Updated tour {tour1.Id} with category: {tour1.Category}");
                }

                var tour2 = await context.Tours.FirstOrDefaultAsync(t => t.Title.Contains("touer 02"));
                if (tour2 != null)
                {
                    tour2.Category = "Beach, Wild Life";
                    Console.WriteLine($"Updated tour {tour2.Id} with category: {tour2.Category}");
                }

                await context.SaveChangesAsync();
                Console.WriteLine("Changes saved successfully.");
            }
        }
    }
}
