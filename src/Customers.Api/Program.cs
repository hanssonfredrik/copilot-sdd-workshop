
using Customers.Api.Data;
using Customers.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Connection string precedence: env var overrides appsettings
var conn = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
          ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(conn));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrate & seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await Seed.ApplyAsync(db);
}

// Enable Swagger in all environments for this demo
app.UseSwagger();
app.UseSwaggerUI();

app.MapCustomers();

app.Run();

// Make Program class accessible to test projects
public partial class Program { }
