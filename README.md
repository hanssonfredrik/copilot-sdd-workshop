
# Customers API - .NET 9 Minimal API

A simple REST API for managing customers built with .NET 9 and Entity Framework Core.

## Prerequisites

- .NET 9 SDK
- Docker Desktop: https://www.docker.com/products/docker-desktop/
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

3. **Run the API**
   ```bash
   cd src/Customers.Api
   dotnet run
   ```
   
   The database schema will be automatically created on first run.

4. **Access the API**
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
