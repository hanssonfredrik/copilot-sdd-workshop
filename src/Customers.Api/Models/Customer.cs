
using System.ComponentModel.DataAnnotations;

namespace Customers.Api.Models;

public class Customer
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; set; }
    
    [Required]
    [EmailAddress]
    [StringLength(254)]
    public required string Email { get; set; }
    
    [Required]
    [Phone]
    [StringLength(15, MinimumLength = 10)]
    public required string Phone { get; set; }
    
    [StringLength(200)]
    public string? Street { get; set; }
    
    [StringLength(100)]
    public string? City { get; set; }
    
    [StringLength(100)]
    public string? State { get; set; }
    
    [StringLength(20)]
    public string? PostalCode { get; set; }
    
    [StringLength(100)]
    public string? Country { get; set; }
    
    public DateTime SignupDate { get; set; } = DateTime.UtcNow;
}
