
using Customers.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Customers.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.Property(x => x.City).HasMaxLength(100);
            b.Property(x => x.SignupDate);
            b.HasIndex(x => x.City);
            b.HasIndex(x => x.SignupDate);
        });
    }
}
