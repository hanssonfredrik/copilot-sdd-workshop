
# Customers API - .NET 8 Minimal API

A simple REST API for managing customers built with .NET 8 and Entity Framework Core.

## Prerequisites

- .NET 8 SDK
- Docker Desktop
- Git

## Setup & Run

1. **Clone and navigate to the repository**
   ```bash
   git clone <repository-url>
   cd copilot-sdd-workshop
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Install Entity Framework tools** (first time only)
   ```bash
   dotnet tool install --global dotnet-ef
   ```

4. **Create and apply database migration**
   ```bash
   cd src/Customers.Api
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the API**
   ```bash
   dotnet run
   ```

6. **Access the API**
   - API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

## API Endpoints

- `GET /customers` - List customers (with pagination and filtering)
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

## Stop Services

```bash
docker-compose down
```
