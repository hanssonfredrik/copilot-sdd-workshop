
namespace Customers.Api.Models;

public class Customer
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? City { get; set; }
    public DateTime SignupDate { get; set; } = DateTime.UtcNow;
}
