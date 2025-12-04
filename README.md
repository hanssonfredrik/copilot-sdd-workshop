
# Customers API - .NET 9 Minimal API

A simple REST API for managing customers built with .NET 9 and Entity Framework Core.

## Prerequisites

- .NET 9 SDK
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Git
- [uv](https://docs.astral.sh/uv/) for package management (required for Spec Kit)

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

## Spec-Driven Development with Spec Kit

This project is set up for Spec-Driven Development using [Spec Kit](https://github.com/github/spec-kit). To get started:

### Install Spec Kit

Install the Specify CLI tool globally using uv:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Then initialize Spec Kit in this project (if not already initialized):

```bash
specify init --here --ai copilot --script ps
```

### Learn More

For detailed instructions on using Spec Kit and the Spec-Driven Development methodology, visit:
- **[Spec Kit Documentation](https://github.com/github/spec-kit)**
- **[Complete Spec-Driven Development Methodology](https://github.com/github/spec-kit/blob/main/spec-driven.md)**

Available slash commands: `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`, and more.
