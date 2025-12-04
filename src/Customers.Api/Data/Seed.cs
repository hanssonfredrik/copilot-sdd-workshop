
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
                new Customer { 
                    Name = "Alice Andersson", 
                    Email = "alice.andersson@example.com",
                    Phone = "+46701234567",
                    Street = "Stora Gatan 1",
                    City = "Malmö", 
                    State = "Skåne",
                    PostalCode = "21143",
                    Country = "Sweden",
                    SignupDate = DateTime.UtcNow.AddDays(-30) 
                },
                new Customer { 
                    Name = "Björn Berg", 
                    Email = "bjorn.berg@example.com",
                    Phone = "+46707654321",
                    Street = "Kungsgatan 42",
                    City = "Stockholm", 
                    State = "Stockholm",
                    PostalCode = "11156",
                    Country = "Sweden",
                    SignupDate = DateTime.UtcNow.AddDays(-20) 
                },
                new Customer { 
                    Name = "Carla Cruz", 
                    Email = "carla.cruz@example.com",
                    Phone = "+46709876543",
                    Street = "Avenyn 15",
                    City = "Göteborg", 
                    State = "Västra Götaland",
                    PostalCode = "41136",
                    Country = "Sweden",
                    SignupDate = DateTime.UtcNow.AddDays(-10) 
                }
            });
            await db.SaveChangesAsync(ct);
        }
    }
}
