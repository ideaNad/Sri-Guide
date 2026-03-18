using Microsoft.EntityFrameworkCore;
using SriGuide.Infrastructure.Persistence;
using SriGuide.Domain.Entities;

var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=sriguide_db;Username=postgres;Password=admin");

using var context = new ApplicationDbContext(optionsBuilder.Options);

try {
    var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@sriguide.lk");

    if (user != null)
    {
        user.PasswordHash = "$2a$11$KeB4Gn4xYDPpB7M7NLWGe.rwHTA5Qt7qQwK0fIFVoZqkp4KnSNRW";
        await context.SaveChangesAsync();
        Console.WriteLine("[SUCCESS] Admin password hash updated successfully.");
    }
    else
    {
        Console.WriteLine("[ERROR] Admin user not found.");
    }
} catch (Exception ex) {
    Console.WriteLine($"[DB ERROR] {ex.Message}");
}
