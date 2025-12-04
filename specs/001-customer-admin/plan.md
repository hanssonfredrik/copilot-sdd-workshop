# Implementation Plan: Customer Admin Interface

**Branch**: `001-customer-admin` | **Date**: December 4, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-customer-admin/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a web-based admin interface for managing customers with CRUD operations (Create, Read/Search, Update, Delete). The interface will consume the existing Customers API and provide admins with the ability to create new customers, search across all customer records, edit customer information, and delete customers with confirmation. The solution will be built as a React/TypeScript SPA served from the existing .NET API project structure.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: C# 14 / .NET 9.0 (backend), TypeScript with strict mode (frontend)  
**Primary Dependencies**: ASP.NET Core Minimal APIs, React 19+, Entity Framework Core 9.0, React Query or SWR (data fetching)  
**Storage**: SQL Server (existing Customer API database)  
**Testing**: xUnit for backend, React Testing Library + Jest for frontend  
**Target Platform**: Web browsers (Chrome, Firefox, Edge, Safari - last 2 versions)
**Project Type**: Web application (frontend + existing backend API)  
**Performance Goals**: <3s search response for 10k customers, <1s form validation feedback, <2s UI updates after mutations  
**Constraints**: 50 records per page pagination, must use existing Customer API endpoints, no authentication implementation (assumed external)  
**Scale/Scope**: Support 10,000+ customer records, 4 primary user flows (create, search, edit, delete), single admin interface application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Research)

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **Type Safety & Modern Features** | ✅ PASS | C# 14/.NET 9 with nullable enabled; TypeScript strict mode required |
| **Clean Architecture** | ✅ PASS | Backend follows feature-based organization; Frontend will use component composition |
| **Test-First Development** | ✅ PASS | TDD workflow mandatory; tests before implementation |
| **API Design Excellence** | ✅ PASS | Existing API uses Minimal APIs with Swagger; no new endpoints required |
| **Security & Validation** | ✅ PASS | Frontend validation + existing API validation; auth assumed external |
| **Performance & Scalability** | ✅ PASS | Async/await, pagination (50 records), React Query for caching |
| **Observability & Monitoring** | ✅ PASS | Error boundaries in React; structured logging on backend |
| **Code Quality** | ✅ PASS | .editorconfig enforced; ESLint + Prettier for frontend |

**Result**: ✅ ALL GATES PASS - Proceed to Phase 0

### Post-Design Check (After Phase 1)

| Principle | Compliance | Design Validation |
|-----------|------------|-------------------|
| **Type Safety & Modern Features** | ✅ PASS | TypeScript strict mode enforced; Zod schemas provide runtime type safety; C# nullable reference types maintained |
| **Clean Architecture** | ✅ PASS | Clear separation: React components (UI), custom hooks (logic), services (API), types (contracts); Backend maintains existing architecture |
| **Test-First Development** | ✅ PASS | Testing strategy defined: React Testing Library + MSW for unit/integration, Playwright for E2E; TDD workflow documented in quickstart |
| **API Design Excellence** | ✅ PASS | API contracts documented in OpenAPI format; RESTful design with proper status codes; Pagination, filtering, sorting implemented |
| **Security & Validation** | ✅ PASS | Two-layer validation (Zod frontend + Data Annotations backend); Email uniqueness enforced via DB constraint; XSS prevention via React's default escaping |
| **Performance & Scalability** | ✅ PASS | React Query handles caching/optimistic updates; Code splitting via React.lazy; Pagination limits dataset size; No heavy UI libraries (small bundle) |
| **Observability & Monitoring** | ✅ PASS | Error Boundaries for component errors; React Query DevTools for debugging; Structured error responses (RFC 7807) |
| **Code Quality** | ✅ PASS | CSS Modules for scoped styling; BEM naming; Semantic HTML; Accessibility considerations (ARIA, keyboard nav) |

**Design Decisions Validated**:
- ✅ React Hook Form + Zod: Industry best practices, excellent TypeScript support
- ✅ TanStack Query: Optimal for server state management, aligns with performance principles
- ✅ Custom components: Avoids bloat, maintains control, faster development for small scope
- ✅ Vite: Fast HMR, modern build tool, simple .NET integration
- ✅ No Redux/Zustand: Follows YAGNI principle; React Context + React Query sufficient
- ✅ Extend existing Customer model: DRY principle; maintains single source of truth

**Result**: ✅ ALL GATES PASS - Design fully compliant with constitution

**Complexity Justification**: No violations requiring justification (see Complexity Tracking table)

## Project Structure

### Documentation (this feature)

```text
specs/001-customer-admin/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (frontend + existing backend)
src/
├── Customers.Api/              # Existing backend (no changes to API endpoints)
│   ├── Models/
│   ├── Data/
│   ├── Endpoints/
│   └── wwwroot/                # New: Static files for SPA
│       └── admin/              # New: Admin interface build output
└── Customers.Admin/            # New: Frontend React application
    ├── public/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   ├── CustomerForm.tsx
    │   │   ├── CustomerList.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── ConfirmDialog.tsx
    │   ├── pages/              # Route-level components
    │   │   ├── CustomersPage.tsx
    │   │   ├── CreateCustomerPage.tsx
    │   │   ├── EditCustomerPage.tsx
    │   │   └── CustomerDetailPage.tsx
    │   ├── services/           # API client
    │   │   └── customersApi.ts
    │   ├── hooks/              # Custom React hooks
    │   │   └── useCustomers.ts
    │   ├── types/              # TypeScript type definitions
    │   │   └── customer.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── tests/                  # Frontend tests
    │   ├── components/
    │   └── integration/
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

tests/
└── Customers.Api.Tests/        # Existing backend tests
```

**Structure Decision**: Web application using existing backend API with new frontend SPA. The React app will be built using Vite and served as static files from the ASP.NET Core application's wwwroot folder. This approach keeps deployment simple while maintaining separation of concerns between frontend and backend code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - All constitution principles are followed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Planning Completion Summary

### Phase 0: Research ✅ COMPLETED
- ✅ [research.md](./research.md) - All technical unknowns resolved
  - Data fetching library: TanStack Query (React Query) v5
  - Form management: React Hook Form + Zod
  - UI strategy: Custom components with CSS Modules
  - Routing: React Router v6
  - Build tool: Vite with .NET integration
  - Testing: React Testing Library + Jest + MSW + Playwright
  - Customer model extension requirements identified

### Phase 1: Design & Contracts ✅ COMPLETED
- ✅ [data-model.md](./data-model.md) - Customer entity fully defined
  - 10 attributes (3 required: Name, Email, Phone; 7 optional address fields)
  - Validation rules for frontend (Zod) and backend (Data Annotations)
  - State transitions documented (Create → Active → Update → Delete)
  - Database schema changes identified
  - Error message specifications
- ✅ [contracts/api-contracts.md](./contracts/api-contracts.md) - API documented
  - 5 REST endpoints (List, Get, Create, Update, Delete)
  - Request/response schemas with TypeScript types
  - Error handling (RFC 7807 Problem Details)
  - Pagination and search parameters
  - Backend changes required for new Customer fields
- ✅ [quickstart.md](./quickstart.md) - Developer guide created
  - Prerequisites and setup instructions
  - Development workflow
  - Testing procedures
  - Production build steps
  - Troubleshooting guide
- ✅ Agent context updated
  - GitHub Copilot instructions updated with new technologies
  - TypeScript, React 19, TanStack Query, Vite added to context
- ✅ Post-design Constitution Check completed
  - All 8 principles validated
  - No violations requiring justification
  - Design decisions aligned with best practices

### Artifacts Generated

```
specs/001-customer-admin/
├── spec.md                          # ✅ Feature specification (from /speckit.specify)
├── plan.md                          # ✅ This file (implementation plan)
├── research.md                      # ✅ Phase 0: Technical research and decisions
├── data-model.md                    # ✅ Phase 1: Entity definitions and validation
├── quickstart.md                    # ✅ Phase 1: Developer setup guide
├── contracts/
│   └── api-contracts.md             # ✅ Phase 1: API endpoint documentation
└── checklists/
    └── requirements.md              # ✅ Specification validation checklist
```

### Next Steps (Not in /speckit.plan scope)

The planning phase is **COMPLETE**. To proceed with implementation:

1. **Run `/speckit.tasks`** to generate tasks.md
   - Break down user stories into actionable development tasks
   - Sequence tasks by priority (P1 → P2 → P3 → P4)
   - Identify dependencies between tasks

2. **Run `/speckit.implement`** to begin development
   - Follow TDD workflow: tests first, then implementation
   - Start with P1 user story (Create New Customer)
   - Extend Customer model with new fields
   - Build React components and pages

3. **Testing Strategy**
   - Write backend tests for extended Customer model and API
   - Write frontend component tests with React Testing Library
   - Write E2E tests with Playwright for complete user flows

### Key Implementation Considerations

⚠️ **Backend Changes Required First**:
1. Extend `Customer.cs` model with Email, Phone, and Address fields
2. Add validation attributes ([Required], [EmailAddress], etc.)
3. Create EF Core migration for database schema changes
4. Update `CustomersEndpoints.cs` to handle new fields
5. Implement email uniqueness check with 409 Conflict response
6. Update seed data with new required fields

⚠️ **Frontend Setup Required**:
1. Create `src/Customers.Admin/` directory
2. Initialize Vite project with TypeScript template
3. Install dependencies (React, React Router, TanStack Query, React Hook Form, Zod)
4. Configure Vite to build to `../Customers.Api/wwwroot/admin`
5. Configure API proxy for development

### Technology Stack Summary

**Frontend**:
- React 19 + TypeScript (strict mode)
- Vite (build tool)
- React Router v6 (routing)
- TanStack Query v5 (data fetching)
- React Hook Form + Zod (forms/validation)
- CSS Modules (styling)
- React Testing Library + Jest + MSW (testing)

**Backend** (existing, requires extension):
- .NET 9 / C# 14
- ASP.NET Core Minimal APIs
- Entity Framework Core 9
- SQL Server
- xUnit (testing)

**Performance Targets** (from Success Criteria):
- Customer creation: <1 minute
- Search response: <3 seconds (10k records)
- UI updates after mutations: <2 seconds
- Form validation feedback: <1 second
- Pagination: 50 records per page

---

## Report

**Branch**: `001-customer-admin`  
**Implementation Plan**: `C:\Projects\lab\copilot-sdd-workshop\specs\001-customer-admin\plan.md`

**Artifacts Generated**:
- ✅ research.md (Phase 0: 10 technical decisions documented)
- ✅ data-model.md (Phase 1: Customer entity with validation rules)
- ✅ contracts/api-contracts.md (Phase 1: 5 API endpoints documented)
- ✅ quickstart.md (Phase 1: Developer setup guide)
- ✅ .github/agents/copilot-instructions.md (Updated with new technologies)

**Constitution Compliance**: ✅ PASS (all 8 principles validated)  
**Complexity Violations**: None  
**Ready for `/speckit.tasks`**: ✅ Yes

**Command completed successfully**. Planning phase is complete.
