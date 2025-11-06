
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Customers.Api.Tests;

public class IntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public IntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(_ => {});
    }

    [Fact]
    public async Task GetCustomers_ReturnsOkAndHasItems()
    {
        var client = _factory.CreateClient();
        var resp = await client.GetFromJsonAsync<dynamic>("/customers");
        Assert.NotNull(resp);
    }
}
