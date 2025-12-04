
using Customers.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Customers.Api.Data;

public static class Seed
{
    public static async Task ApplyAsync(AppDbContext db, CancellationToken ct = default)
    {
        await db.Database.EnsureCreatedAsync(ct);
        if (!await db.Customers.AnyAsync(ct))
        {
            db.Customers.AddRange(new[] {
                new Customer { Name = "Alice Andersson", City = "Malmö", SignupDate = DateTime.UtcNow.AddDays(-30) },
                new Customer { Name = "Björn Berg", City = "Stockholm", SignupDate = DateTime.UtcNow.AddDays(-20) },
                new Customer { Name = "Carla Cruz", City = "Göteborg", SignupDate = DateTime.UtcNow.AddDays(-10) }
            });
            await db.SaveChangesAsync(ct);
        }
    }
}
