
# Customers API - .NET 9 Minimal API with Admin Interface

A REST API for managing customers built with .NET 9, Entity Framework Core, and a modern React-based admin interface.

## 🚀 Features

**Backend API:**
- RESTful endpoints for customer management
- Entity Framework Core with SQL Server
- Automatic database migrations
- Email uniqueness validation
- Pagination and search functionality

**Admin Interface:**
- Modern React 19 + TypeScript SPA
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time search with debouncing
- Form validation with Zod
- Responsive design with CSS Modules
- Toast notifications for user feedback

## Prerequisites

- .NET 9 SDK
- Node.js 18+ (for admin interface)
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Git
- [uv](https://docs.astral.sh/uv/getting-started/installation/) for package management (required for Spec Kit)

## Setup & Run

1. **Clone and navigate to the repository**
   ```bash
   git clone https://github.com/hanssonfredrik/copilot-sdd-workshop.git
   cd copilot-sdd-workshop
   ```

2. **Install the Specify CLI tool globally using uv**
   ```bash
   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
   ```

3. **Start the database**
   ```bash
   docker-compose up -d
   ```

4. **Build the Admin Interface**
   ```bash
   cd src/Customers.Admin
   npm install
   npm run build
   cd ../..
   ```

5. **Run the API**
   ```bash
   cd src/Customers.Api
   dotnet run
   ```
   
   The database schema will be automatically created on first run.

6. **Access the Application**
   - **Admin Interface**: http://localhost:5000/admin
   - API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

## Admin Interface

The admin interface provides a complete customer management experience:

### Features
- ✅ **Create Customers**: Form with validation for required and optional fields
- ✅ **Search & Filter**: Debounced search by name, email, or phone
- ✅ **View Details**: Complete customer information display
- ✅ **Edit Customers**: Update customer information with validation
- ✅ **Delete Customers**: Remove customers with confirmation dialog
- ✅ **Pagination**: Browse large customer lists (50 per page)
- ✅ **Responsive**: Works on desktop and mobile devices

### Development

To run the admin interface in development mode with hot reload:

```bash
cd src/Customers.Admin
npm run dev
# Opens at http://localhost:5173 with API proxy
```

See [src/Customers.Admin/README.md](src/Customers.Admin/README.md) for detailed documentation.

## API Endpoints

- `GET /customers` - List customers (with pagination and filtering)
  - Query parameters: `page`, `pageSize`, `search`, `email`, `phone`, `city`
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
