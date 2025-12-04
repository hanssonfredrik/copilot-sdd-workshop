
using Customers.Api.Data;
using Customers.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Connection string precedence: env var overrides appsettings
var conn = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
          ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(conn));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrate & seed (skip in test environment)
if (!app.Environment.IsEnvironment("Testing"))
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await Seed.ApplyAsync(db);
    }
}

// Enable Swagger in all environments for this demo
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

// Serve static files for admin interface
app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = new[] { "index.html" },
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "wwwroot/admin")
    ),
    RequestPath = "/admin"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "wwwroot/admin")
    ),
    RequestPath = "/admin"
});

app.MapCustomers();

// SPA fallback routing for admin interface
app.MapFallbackToFile("/admin/{*path:nonfile}", "/admin/index.html");

app.Run();

// Make Program class accessible to test projects
public partial class Program { }
