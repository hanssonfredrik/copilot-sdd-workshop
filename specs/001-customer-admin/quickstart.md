# Quickstart Guide: Customer Admin Interface

**Feature**: Customer Admin Interface  
**Created**: December 4, 2025  
**Prerequisites**: Node.js 20+, .NET 9 SDK, Docker Desktop, Git

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Building for Production](#building-for-production)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Customer Admin Interface is a React/TypeScript SPA that provides CRUD operations for managing customer records. It consumes the existing Customers API and is served as static files from the ASP.NET Core application.

**Tech Stack**:
- **Frontend**: React 19, TypeScript, Vite, TanStack Query, React Router
- **Backend**: .NET 9, ASP.NET Core Minimal APIs, Entity Framework Core
- **Database**: SQL Server (via Docker)

---

## Prerequisites

Ensure you have the following installed:

| Tool | Version | Download Link |
|------|---------|---------------|
| Node.js | 20+ | https://nodejs.org/ |
| npm | 10+ | Included with Node.js |
| .NET SDK | 9.0+ | https://dotnet.microsoft.com/download |
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop/ |
| Git | Latest | https://git-scm.com/ |

**Verify installations**:
```powershell
node --version     # Should show v20.x.x or higher
npm --version      # Should show 10.x.x or higher
dotnet --version   # Should show 9.0.x or higher
docker --version   # Should show 20.x.x or higher
```

---

## Initial Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/hanssonfredrik/copilot-sdd-workshop.git
cd copilot-sdd-workshop
git checkout 001-customer-admin
```

### 2. Start the Database

The project uses SQL Server in a Docker container:

```powershell
docker-compose up -d
```

**Verify database is running**:
```powershell
docker ps
# Should show a container named "copilot-sdd-workshop_sqlserver"
```

**Database connection details**:
- **Host**: `localhost,1433`
- **Database**: `CustomersDB`
- **Username**: `sa`
- **Password**: `YourStrong@Passw0rd` (from docker-compose.yml)

---

## Backend Setup

### 3. Navigate to Backend Project

```powershell
cd src/Customers.Api
```

### 4. Restore Dependencies

```powershell
dotnet restore
```

### 5. Apply Database Migrations

The application uses Entity Framework Core. Migrations are applied automatically on startup, but you can run them manually:

```powershell
dotnet ef database update
```

**Note**: If migrations don't exist yet (new fields for email, phone, address), create them:
```powershell
dotnet ef migrations add AddCustomerContactFields
dotnet ef database update
```

### 6. Run the Backend

```powershell
dotnet run
```

**Expected output**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 7. Verify API is Running

Open browser and navigate to:
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/customers (should return paginated customer list)

**Keep this terminal running** - the backend must be active for frontend development.

---

## Frontend Setup

### 8. Open New Terminal and Navigate to Frontend

```powershell
cd src/Customers.Admin
```

*Note: If the `Customers.Admin` directory doesn't exist yet, you'll need to create it as part of the implementation phase.*

### 9. Install Frontend Dependencies

```powershell
npm install
```

**Dependencies installed** (from package.json):
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching
- `react-hook-form` - Form management
- `zod` - Schema validation
- `typescript` - Type safety
- `vite` - Build tool

### 10. Start Frontend Development Server

```powershell
npm run dev
```

**Expected output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 11. Open Admin Interface

Navigate to: **http://localhost:5173/**

You should see the Customer Admin Interface with:
- Customer list/search page
- Navigation to create new customer
- Ability to edit and delete customers

---

## Development Workflow

### Hot Reload (HMR)

Both frontend and backend support hot reloading:

**Frontend (Vite)**:
- Edit any `.tsx` or `.ts` file in `src/Customers.Admin/src/`
- Browser auto-refreshes with changes (usually <1 second)

**Backend (.NET)**:
- Use `dotnet watch run` instead of `dotnet run` for auto-restart on changes
- Edit `.cs` files and save - app restarts automatically

### Project Structure

```
src/
├── Customers.Api/              # Backend (.NET 9)
│   ├── Models/
│   │   └── Customer.cs         # Data model (extend with new fields)
│   ├── Data/
│   │   ├── AppDbContext.cs     # EF Core context
│   │   └── Seed.cs             # Sample data
│   ├── Endpoints/
│   │   └── CustomersEndpoints.cs  # API endpoints
│   └── Program.cs              # App entry point
│
└── Customers.Admin/            # Frontend (React/TypeScript)
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   ├── CustomerForm.tsx
    │   │   ├── CustomerList.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── ConfirmDialog.tsx
    │   ├── pages/              # Page-level components
    │   │   ├── CustomersPage.tsx
    │   │   ├── CreateCustomerPage.tsx
    │   │   ├── EditCustomerPage.tsx
    │   │   └── CustomerDetailPage.tsx
    │   ├── services/           # API client
    │   │   └── customersApi.ts
    │   ├── hooks/              # Custom hooks
    │   │   └── useCustomers.ts
    │   ├── types/              # TypeScript types
    │   │   └── customer.ts
    │   ├── App.tsx             # Root component with routing
    │   └── main.tsx            # Entry point
    ├── tests/                  # Frontend tests
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

### Making Changes

**Adding/Modifying a Component**:
1. Create/edit file in `src/Customers.Admin/src/components/`
2. Import and use in page components
3. Write tests in `tests/components/`

**Adding/Modifying API Endpoint**:
1. Update `src/Customers.Api/Endpoints/CustomersEndpoints.cs`
2. Update `src/Customers.Api/Models/Customer.cs` if needed
3. Create EF migration: `dotnet ef migrations add MigrationName`
4. Update frontend types in `src/Customers.Admin/src/types/customer.ts`
5. Update API client in `src/Customers.Admin/src/services/customersApi.ts`

---

## Testing

### Backend Tests (xUnit)

```powershell
cd tests/Customers.Api.Tests
dotnet test
```

**Run specific test**:
```powershell
dotnet test --filter "FullyQualifiedName~IntegrationTests.GetCustomersReturnsOk"
```

**Run with coverage**:
```powershell
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Tests (Jest + React Testing Library)

```powershell
cd src/Customers.Admin
npm test
```

**Run specific test**:
```powershell
npm test -- CustomerForm.test.tsx
```

**Run with coverage**:
```powershell
npm test -- --coverage
```

### End-to-End Tests (Playwright)

```powershell
cd src/Customers.Admin
npm run test:e2e
```

**Prerequisites for E2E**:
- Both backend and frontend must be running
- Test database should have sample data

---

## Building for Production

### 1. Build Frontend

```powershell
cd src/Customers.Admin
npm run build
```

This builds the React app and outputs static files to:
```
src/Customers.Api/wwwroot/admin/
```

### 2. Configure Backend to Serve SPA

Add to `Program.cs` (if not already present):

```csharp
app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = new[] { "index.html" },
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot/admin")
    ),
    RequestPath = "/admin"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot/admin")
    ),
    RequestPath = "/admin"
});

// SPA fallback routing
app.MapFallbackToFile("/admin/{*path:nonfile}", "/admin/index.html");
```

### 3. Publish Backend

```powershell
cd src/Customers.Api
dotnet publish -c Release -o ./publish
```

### 4. Run Production Build Locally

```powershell
cd publish
dotnet Customers.Api.dll
```

Navigate to: **http://localhost:5000/admin**

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Symptoms**: `SqlException: A connection was successfully established with the server...`

**Solutions**:
1. Ensure Docker is running: `docker ps`
2. Verify SQL Server container is up: `docker logs copilot-sdd-workshop_sqlserver-1`
3. Check connection string in `appsettings.json`
4. Restart database: `docker-compose restart`

---

### Issue: "Port 5000 already in use"

**Symptoms**: `System.IO.IOException: Failed to bind to address http://127.0.0.1:5000`

**Solutions**:
1. Kill process using port: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
2. Change port in `launchSettings.json` or use `dotnet run --urls "http://localhost:5001"`

---

### Issue: "Frontend can't reach API (CORS error)"

**Symptoms**: `Access to fetch at 'http://localhost:5000/customers' from origin 'http://localhost:5173' has been blocked by CORS`

**Solutions**:
1. Ensure backend has CORS configured in `Program.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddDefaultPolicy(policy =>
       {
           policy.WithOrigins("http://localhost:5173")
                 .AllowAnyMethod()
                 .AllowAnyHeader();
       });
   });
   // ...
   app.UseCors();
   ```
2. Restart backend after adding CORS
3. Alternatively, use Vite proxy in `vite.config.ts` (see research.md Decision 6)

---

### Issue: "npm install fails"

**Symptoms**: Various errors during `npm install`

**Solutions**:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`: `rm -r node_modules; rm package-lock.json`
3. Retry: `npm install`
4. Update npm: `npm install -g npm@latest`

---

### Issue: "EF Migration fails"

**Symptoms**: `Build failed` or `Unable to create an object of type 'AppDbContext'`

**Solutions**:
1. Ensure you're in the correct directory: `cd src/Customers.Api`
2. Verify project builds: `dotnet build`
3. Check connection string is accessible
4. Run with explicit project: `dotnet ef migrations add MigrationName --project src/Customers.Api`

---

### Issue: "React Query not updating after mutation"

**Symptoms**: Customer list doesn't refresh after create/edit/delete

**Solutions**:
1. Ensure `queryClient.invalidateQueries()` is called in mutation's `onSuccess`
2. Check React Query DevTools (should be visible in dev mode)
3. Verify query keys match between `useQuery` and `invalidateQueries`

---

## Additional Resources

- **Project Spec**: [spec.md](./spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/api-contracts.md](./contracts/api-contracts.md)
- **Research Decisions**: [research.md](./research.md)
- **Constitution**: [../../.specify/memory/constitution.md](../../.specify/memory/constitution.md)

---

## Getting Help

1. Check **Troubleshooting** section above
2. Review error messages carefully (often contain solution hints)
3. Check project issues on GitHub
4. Review React Query docs: https://tanstack.com/query/latest
5. Review Vite docs: https://vitejs.dev/

---

## Next Steps

After setup, proceed to:
1. Review user stories in [spec.md](./spec.md)
2. Run existing tests to understand current functionality
3. Follow TDD workflow: Write tests → Implement → Verify
4. Start with P1 user story (Create New Customer)

---

**Happy coding!** 🚀
