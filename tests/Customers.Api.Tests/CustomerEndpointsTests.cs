using System.Net;
using System.Net.Http.Json;
using Xunit;
using Customers.Api.Models;

namespace Customers.Api.Tests;

public class CustomerEndpointsTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CustomerEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task POST_CreateCustomer_WithValidData_ReturnsCreatedCustomer()
    {
        // Arrange
        var newCustomer = new
        {
            Name = "Test Customer",
            Email = "test@example.com",
            Phone = "+1-555-0100",
            Street = "123 Test St",
            City = "Test City",
            State = "TS",
            PostalCode = "12345",
            Country = "Test Country"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/customers", newCustomer);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var customer = await response.Content.ReadFromJsonAsync<Customer>();
        Assert.NotNull(customer);
        Assert.True(customer.Id > 0);
        Assert.Equal(newCustomer.Name, customer.Name);
        Assert.Equal(newCustomer.Email, customer.Email);
        Assert.Equal(newCustomer.Phone, customer.Phone);
    }

    [Fact]
    public async Task POST_CreateCustomer_WithMissingRequiredFields_ReturnsBadRequest()
    {
        // Arrange
        var invalidCustomer = new
        {
            Name = "Test Customer"
            // Missing Email and Phone (required fields)
        };

        // Act
        var response = await _client.PostAsJsonAsync("/customers", invalidCustomer);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task POST_CreateCustomer_WithDuplicateEmail_ReturnsConflict()
    {
        // Arrange - Create first customer
        var firstCustomer = new
        {
            Name = "First Customer",
            Email = "duplicate@example.com",
            Phone = "+1-555-0101"
        };
        await _client.PostAsJsonAsync("/customers", firstCustomer);

        // Arrange - Try to create second customer with same email
        var secondCustomer = new
        {
            Name = "Second Customer",
            Email = "duplicate@example.com",
            Phone = "+1-555-0102"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/customers", secondCustomer);

        // Assert
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task POST_CreateCustomer_WithInvalidEmail_ReturnsBadRequest()
    {
        // Arrange
        var invalidCustomer = new
        {
            Name = "Test Customer",
            Email = "not-an-email",
            Phone = "+1-555-0103"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/customers", invalidCustomer);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
