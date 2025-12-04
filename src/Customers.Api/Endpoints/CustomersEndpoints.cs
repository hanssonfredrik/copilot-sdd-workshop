
using Customers.Api.Data;
using Customers.Api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

    public static async Task<Ok<object>> GetCustomers(AppDbContext db, int page = 1, int pageSize = 50, string? name = null, string? email = null, string? phone = null, string? city = null, DateTime? from = null, DateTime? to = null)
    {
        var query = db.Customers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(name)) query = query.Where(c => c.Name.Contains(name));
        if (!string.IsNullOrWhiteSpace(email)) query = query.Where(c => c.Email.Contains(email));
        if (!string.IsNullOrWhiteSpace(phone)) query = query.Where(c => c.Phone.Contains(phone));
        if (!string.IsNullOrWhiteSpace(city)) query = query.Where(c => c.City == city);
        if (from is not null) query = query.Where(c => c.SignupDate >= from);
        if (to is not null) query = query.Where(c => c.SignupDate <= to);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.SignupDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return TypedResults.Ok((object)new { total, page, pageSize, items });
    }

    public static async Task<Results<Ok<Customer>, NotFound>> GetById(AppDbContext db, int id)
    {
        var entity = await db.Customers.FindAsync(id);
        return entity is null ? TypedResults.NotFound() : TypedResults.Ok(entity);
    }

    public static async Task<Results<Created<Customer>, BadRequest<ProblemDetails>, Conflict<ProblemDetails>>> Create(AppDbContext db, Customer input)
    {
        // Check for duplicate email
        if (await db.Customers.AnyAsync(c => c.Email == input.Email))
        {
            return TypedResults.Conflict(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7807",
                Title = "Email address already exists.",
                Status = StatusCodes.Status409Conflict,
                Detail = $"A customer with email '{input.Email}' already exists in the system."
            });
        }

        db.Customers.Add(input);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/customers/{input.Id}", input);
    }

    public static async Task<Results<NoContent, NotFound, Conflict<ProblemDetails>>> Update(AppDbContext db, int id, Customer update)
    {
        var entity = await db.Customers.FindAsync(id);
        if (entity is null) return TypedResults.NotFound();

        // Check for duplicate email (excluding current customer)
        if (await db.Customers.AnyAsync(c => c.Email == update.Email && c.Id != id))
        {
            return TypedResults.Conflict(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7807",
                Title = "Email address already exists.",
                Status = StatusCodes.Status409Conflict,
                Detail = $"A customer with email '{update.Email}' already exists in the system."
            });
        }

        entity.Name = update.Name;
        entity.Email = update.Email;
        entity.Phone = update.Phone;
        entity.Street = update.Street;
        entity.City = update.City;
        entity.State = update.State;
        entity.PostalCode = update.PostalCode;
        entity.Country = update.Country;
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
