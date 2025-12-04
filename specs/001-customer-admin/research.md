# Research: Customer Admin Interface

**Feature**: Customer Admin Interface  
**Created**: December 4, 2025  
**Purpose**: Research findings to resolve technical unknowns and establish best practices

## Research Tasks Completed

1. ✅ React 19 features and best practices for admin interfaces
2. ✅ Data fetching library selection (React Query vs SWR)
3. ✅ Vite configuration for .NET backend integration
4. ✅ Form validation patterns in React/TypeScript
5. ✅ Component composition strategies for CRUD operations
6. ✅ Error handling and loading state patterns
7. ✅ Serving SPA from ASP.NET Core

---

## Decision 1: Data Fetching Library

**Decision**: Use **TanStack Query (React Query) v5**

**Rationale**:
- Industry standard for server state management in React applications
- Built-in features for mutations, optimistic updates, and cache invalidation
- Excellent TypeScript support with type inference
- Automatic refetching, caching, and background updates
- Better DevTools for debugging API interactions
- Simpler API for CRUD operations compared to SWR
- Active maintenance and large community

**Alternatives Considered**:
- **SWR**: Lighter weight but less feature-rich; lacks built-in mutation support
- **RTK Query**: More boilerplate; better suited for Redux-heavy apps
- **Axios + manual state**: Too much manual cache and loading state management

**Implementation Notes**:
- Use `useQuery` for GET operations (list, search, detail)
- Use `useMutation` for CREATE, UPDATE, DELETE operations
- Configure query keys by entity and ID for proper cache invalidation
- Implement optimistic updates for better UX on mutations

---

## Decision 2: Form Management and Validation

**Decision**: Use **React Hook Form** with **Zod** for schema validation

**Rationale**:
- React Hook Form provides excellent performance (uncontrolled components)
- Minimal re-renders compared to Formik or manual state
- Native TypeScript support with type-safe form values
- Zod provides runtime validation with TypeScript type inference
- Schema can be shared between frontend and backend validation
- Built-in error handling and touched state management
- Simple API: `register`, `handleSubmit`, `formState`

**Alternatives Considered**:
- **Formik**: More re-renders, larger bundle size
- **Manual state + validation**: Error-prone, lots of boilerplate
- **Native HTML validation only**: Insufficient for complex business rules

**Implementation Notes**:
- Define Zod schemas for Customer create and update
- Use `zodResolver` to integrate Zod with React Hook Form
- Display validation errors inline near form fields
- Validate on blur for better UX (not on every keystroke)

---

## Decision 3: UI Component Strategy

**Decision**: Build **custom components** with **CSS Modules** (no external UI library)

**Rationale**:
- Admin interface has simple, standard form elements
- Avoiding Material-UI/Ant Design reduces bundle size significantly (~300KB)
- Custom components give full control over styling and behavior
- CSS Modules provide scoped styling without CSS-in-JS overhead
- Faster development for small scope (4 pages, ~6 components)
- Easier to maintain without library version dependencies

**Alternatives Considered**:
- **Material-UI (MUI)**: Overkill for simple CRUD interface; large bundle
- **shadcn/ui**: Better option but adds build complexity with Tailwind
- **Ant Design**: Good for admin but still heavyweight

**Implementation Notes**:
- Create reusable components: Button, Input, Modal, Table, Pagination
- Use semantic HTML for accessibility (proper labels, ARIA attributes)
- Implement keyboard navigation for forms and tables
- CSS Modules with BEM naming convention for clarity

---

## Decision 4: Routing

**Decision**: Use **React Router v6**

**Rationale**:
- Industry standard for React SPA routing
- Simple declarative API with nested routes
- Built-in hooks for navigation (`useNavigate`, `useParams`)
- TypeScript support for route parameters
- Supports browser history API for clean URLs

**Alternatives Considered**:
- **TanStack Router**: Too new, less ecosystem support
- **No router (single page)**: Poor UX, can't bookmark specific customers

**Implementation Notes**:
```
/customers              -> List/search page
/customers/new          -> Create customer form
/customers/:id          -> Customer detail view
/customers/:id/edit     -> Edit customer form
```

---

## Decision 5: TypeScript Configuration

**Decision**: Use **strict mode** with all strict checks enabled

**Rationale**:
- Constitution mandates TypeScript strict mode
- Catches null/undefined errors at compile time
- Enforces proper type annotations
- Better IDE support and autocomplete
- Prevents common runtime errors

**Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

---

## Decision 6: Vite Configuration for .NET Integration

**Decision**: Configure Vite to build to `../Customers.Api/wwwroot/admin` and proxy API calls during development

**Rationale**:
- Vite provides fast HMR (Hot Module Replacement) during development
- Building to wwwroot allows ASP.NET Core to serve the SPA
- Proxy configuration enables CORS-free API calls during development
- Simple deployment: single ASP.NET application serves both API and UI

**Configuration**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: '../Customers.Api/wwwroot/admin',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/customers': 'http://localhost:5000'
    }
  }
})
```

**Implementation Notes**:
- ASP.NET Core serves frontend at `/admin` path
- Configure fallback route for SPA (return index.html for unknown paths)
- Use relative API paths (`/customers`) in frontend code

---

## Decision 7: Error Handling Strategy

**Decision**: Implement **Error Boundaries** + **React Query error states** + **toast notifications**

**Rationale**:
- Error Boundaries catch component-level errors (constitution requirement)
- React Query provides built-in error state for API failures
- Toast notifications give non-blocking user feedback
- Combination provides defense in depth

**Alternatives Considered**:
- **Alert/modal for every error**: Too intrusive, poor UX
- **Inline errors only**: May miss critical errors

**Implementation Notes**:
- Create ErrorBoundary component wrapping app root
- Use React Query's `isError` and `error` from hooks
- Create Toast component for success/error messages
- Log errors to console for debugging (structured logging)

---

## Decision 8: State Management

**Decision**: Use **React Context** for global UI state (toast, modal) + **React Query** for server state

**Rationale**:
- No need for Redux/Zustand for simple admin interface
- React Context sufficient for toast notifications and modal state
- React Query handles all server state (customers data)
- Component state for local UI state (form input, dropdowns)
- Follows "use the right tool" principle - no over-engineering

**Alternatives Considered**:
- **Redux Toolkit**: Overkill for 4 pages with minimal global state
- **Zustand**: Better than Redux but still unnecessary

---

## Decision 9: Testing Strategy

**Decision**: **React Testing Library** for components + **MSW** for API mocking + **Playwright** for E2E

**Rationale**:
- React Testing Library tests user behavior, not implementation (constitution-aligned)
- MSW (Mock Service Worker) intercepts API calls for reliable tests
- Playwright for critical user flows (create, search, edit, delete)
- Follows test-first development mandate from constitution

**Test Coverage Plan**:
- Unit tests for all form components with validation
- Integration tests for page components with mocked API
- E2E tests for complete user journeys (P1-P4 from spec)

---

## Decision 10: Customer Model Alignment

**Decision**: **Extend existing Customer model** to include email and phone fields

**Current Model** (from Customers.Api):
```csharp
public class Customer
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? City { get; set; }
    public DateTime SignupDate { get; set; }
}
```

**Required Changes** (from spec):
- Add `Email` (required, unique)
- Add `Phone` (required)
- Add address fields: `Street`, `State`, `PostalCode`, `Country` (all optional)
- Add validation attributes

**Rationale**:
- Spec requires email, phone, and full address
- Existing API model must be extended before frontend can use these fields
- Backend changes required before frontend implementation

**Alternatives Considered**:
- **Create separate AdminCustomer model**: Violates DRY, creates maintenance burden
- **Use only existing fields**: Doesn't meet functional requirements FR-001, FR-002

---

## Best Practices Summary

### React/TypeScript
- Use functional components with hooks (no class components)
- Implement proper component composition
- Use `React.memo` sparingly (only for expensive renders)
- Leverage `useMemo` and `useCallback` for optimization
- Custom hooks for reusable logic (`useCustomers`, `useCustomerForm`)

### API Integration
- Centralize API client in `services/customersApi.ts`
- Use async/await with proper error handling
- Include proper HTTP headers (Content-Type, Accept)
- Handle loading, success, and error states consistently

### Accessibility
- Use semantic HTML (`<form>`, `<button>`, `<input>`)
- Include proper ARIA labels and roles
- Support keyboard navigation (Tab, Enter, Escape)
- Test with screen readers if possible
- Ensure color contrast meets WCAG 2.1 AA

### Performance
- Code split routes with `React.lazy` and `Suspense`
- Optimize images if any are added
- Minimize bundle size (no heavy UI libraries)
- Use pagination for customer list (50 records per page)

---

## Open Questions Resolved

~~1. **Page size for pagination?**~~ → **Resolved**: 50 records per page (from spec FR-015)

~~2. **Authentication mechanism?**~~ → **Resolved**: Assumed external, out of scope (from spec Assumptions)

~~3. **Soft delete vs hard delete?**~~ → **Resolved**: Soft delete preferred (from spec Assumptions)

---

## Technology Stack Summary

**Frontend**:
- React 19 with TypeScript (strict mode)
- Vite (build tool)
- React Router v6 (routing)
- TanStack Query v5 (data fetching)
- React Hook Form + Zod (forms/validation)
- CSS Modules (styling)
- React Testing Library + Jest + MSW (testing)

**Backend** (existing):
- .NET 9 / C# 14
- ASP.NET Core Minimal APIs
- Entity Framework Core 9
- SQL Server
- xUnit (testing)

**Development**:
- TypeScript Compiler (type checking)
- ESLint + Prettier (code quality)
- Playwright (E2E testing)

---

## Next Steps

1. ✅ Research complete - all technical unknowns resolved
2. ➡️ **Phase 1**: Generate data-model.md with Customer entity definition
3. ➡️ **Phase 1**: Generate contracts/ with API endpoint documentation
4. ➡️ **Phase 1**: Generate quickstart.md for developer setup
5. ➡️ **Phase 1**: Update agent context with new technologies
6. ➡️ **Phase 1**: Re-evaluate Constitution Check post-design
