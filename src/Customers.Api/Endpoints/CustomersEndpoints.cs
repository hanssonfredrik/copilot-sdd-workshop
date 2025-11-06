
using Customers.Api.Data;
using Customers.Api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Customers.Api.Endpoints;

public static class CustomersEndpoints
{
    public static IEndpointRouteBuilder MapCustomers(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/customers")
                       .WithTags("Customers");

        group.MapGet("", GetCustomers);
        group.MapGet("/{id:int}", GetById);
        group.MapPost("", Create);
        group.MapPut("/{id:int}", Update);
        group.MapDelete("/{id:int}", Delete);

        return app;
    }

    public static async Task<Ok<object>> GetCustomers(AppDbContext db, int page = 1, int pageSize = 10, string? city = null, DateTime? from = null, DateTime? to = null)
    {
        var query = db.Customers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(city)) query = query.Where(c => c.City == city);
        if (from is not null) query = query.Where(c => c.SignupDate >= from);
        if (to is not null) query = query.Where(c => c.SignupDate <= to);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.SignupDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new { c.Id, c.Name, c.City, c.SignupDate })
            .ToListAsync();

        return TypedResults.Ok((object)new { total, page, pageSize, items });
    }

    public static async Task<Results<Ok<Customer>, NotFound>> GetById(AppDbContext db, int id)
    {
        var entity = await db.Customers.FindAsync(id);
        return entity is null ? TypedResults.NotFound() : TypedResults.Ok(entity);
    }

    public static async Task<Created<Customer>> Create(AppDbContext db, Customer input)
    {
        db.Customers.Add(input);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/customers/{input.Id}", input);
    }

    public static async Task<Results<NoContent, NotFound>> Update(AppDbContext db, int id, Customer update)
    {
        var entity = await db.Customers.FindAsync(id);
        if (entity is null) return TypedResults.NotFound();
        entity.Name = update.Name;
        entity.City = update.City;
        entity.SignupDate = update.SignupDate;
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    public static async Task<Results<NoContent, NotFound>> Delete(AppDbContext db, int id)
    {
        var entity = await db.Customers.FindAsync(id);
        if (entity is null) return TypedResults.NotFound();
        db.Remove(entity);
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }
}
