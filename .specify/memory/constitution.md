# Customers API Constitution

<!--
SYNC IMPACT REPORT - Version 1.0.0 (Initial Ratification)
===========================================================
Version: N/A → 1.0.0 (INITIAL)
Ratification Date: 2025-12-04
Last Amended: 2025-12-04

New Principles Added:
- I. Type Safety & Modern Language Features
- II. Clean Architecture & Separation of Concerns
- III. Test-First Development (NON-NEGOTIABLE)
- IV. API Design Excellence
- V. Security & Validation
- VI. Performance & Scalability
- VII. Observability & Monitoring
- VIII. Code Quality & Maintainability

Templates Status:
✅ plan-template.md - Reviewed, aligns with constitution principles
✅ spec-template.md - Reviewed, user story approach supports test-first principle
✅ tasks-template.md - Reviewed, phase-based structure supports foundational principles
⚠ Commands directory - To be reviewed for agent-specific references

Follow-up Actions:
- Review command files in .specify/templates/commands/ for consistency
- Ensure all runtime guidance documents reference these principles
- Update any existing documentation to align with constitution

This is the initial constitution establishing governance and principles for the Customers API project.
-->

## Core Principles

### I. Type Safety & Modern Language Features

**C# & .NET**: MUST use C# 14 features and .NET 8+. Nullable reference types MUST be enabled. Use `is null`/`is not null` for null checks. Leverage pattern matching, switch expressions, `nameof`, and file-scoped namespaces. Trust the type system—avoid redundant null checks when types guarantee non-nullability.

**TypeScript & React**: MUST use strict mode in `tsconfig.json`. Define interfaces for props, state, and component definitions. Use generic components where appropriate. Leverage React's built-in types (`React.FC`, `React.ComponentProps`). Create union types for component variants.

**Rationale**: Type safety catches errors at compile time, enables better IDE support, improves maintainability, and serves as living documentation. Modern language features reduce boilerplate and increase code clarity.

---

### II. Clean Architecture & Separation of Concerns

**Backend (.NET)**: Organize by feature or domain. Separate concerns clearly: Models (domain entities), Services (business logic), Data (persistence), Endpoints/Controllers (API layer). Repository pattern ONLY when justified (see Complexity Tracking). Use dependency injection for loose coupling.

**Frontend (React/TypeScript)**: Use functional components with hooks. Separate presentational and container components. Organize by feature/domain for scalability. Create custom hooks for reusable stateful logic. Implement proper component composition over inheritance.

**Rationale**: Clear separation enables independent testing, parallel development, easier maintenance, and reduces cognitive load. Each layer has a single, well-defined responsibility.

---

### III. Test-First Development (NON-NEGOTIABLE)

**Mandatory TDD Cycle**: Tests written → User approved → Tests fail → Implementation → Tests pass → Refactor.

**C# Testing**: Use xUnit, NUnit, or MSTest with `PageTest` inheritance for integration tests. NO "Act", "Arrange", "Assert" comments—follow existing style. Test critical paths, authentication/authorization logic, and API endpoints. Mock dependencies effectively.

**React Testing**: Use React Testing Library and Jest. Test component behavior, not implementation details. Test accessibility features and keyboard navigation. Write integration tests for complex component interactions.

**Contract Testing**: Required for new library contracts, contract changes, inter-service communication, and shared schemas.

**Rationale**: Test-first ensures requirements are understood, prevents regressions, enables confident refactoring, and serves as executable documentation. Tests define the contract before implementation.

---

### IV. API Design Excellence

**Minimal APIs or Controllers**: Use consistent patterns across the API. Implement proper HTTP verbs and status codes. Support pagination, filtering, and sorting for collections.

**Versioning**: MUST implement API versioning strategy (URL-based, header-based, or query string). Document version changes clearly.

**Documentation**: Implement Swagger/OpenAPI with complete documentation of endpoints, parameters, responses, and authentication requirements. Include `<example>` and `<code>` XML doc comments for public APIs.

**Error Handling**: Implement RFC 7807 Problem Details for standardized error responses. Global exception handling via middleware. Provide meaningful, actionable error messages.

**Rationale**: Well-designed APIs reduce integration friction, improve developer experience, and enable evolution without breaking clients. Consistent patterns reduce cognitive load.

---

### V. Security & Validation

**Input Validation**: Use data annotations and FluentValidation. Validate at entry points—controllers/endpoints. Sanitize user inputs to prevent XSS attacks. Escape data before rendering.

**Authentication & Authorization**: Implement JWT Bearer tokens for API authentication. Use role-based and policy-based authorization. Secure both Minimal APIs and controller-based APIs consistently. Consider OAuth 2.0/OpenID Connect for enterprise scenarios.

**Dependencies**: Keep dependencies current. Audit for security vulnerabilities regularly. Use HTTPS for all external API calls. Implement Content Security Policy (CSP) headers.

**Sensitive Data**: Never store secrets in code. Use environment-specific configuration. Avoid storing sensitive data in localStorage/sessionStorage.

**Rationale**: Security is non-negotiable. Validation at boundaries prevents invalid data propagation. Defense in depth protects against multiple attack vectors.

---

### VI. Performance & Scalability

**Asynchronous Programming**: Use async/await throughout. Understand why asynchronous patterns matter for API performance. Avoid blocking calls.

**Caching**: Implement appropriate caching strategies (in-memory, distributed, response caching). Use `React.memo`, `useMemo`, and `useCallback` judiciously in React to prevent unnecessary re-renders.

**Optimization**: Implement pagination for large datasets. Use proper query patterns to avoid N+1 problems. Implement code splitting with `React.lazy` and `Suspense`. Optimize bundle size with tree shaking and dynamic imports. Profile with React DevTools and performance monitoring tools.

**Data Fetching**: Use modern libraries (React Query, SWR, Apollo Client) for server state. Implement proper loading, error, and success states. Handle race conditions and request cancellation. Use optimistic updates for better UX.

**Rationale**: Performance affects user satisfaction and operational costs. Scalability ensures the system handles growth. Early optimization in critical paths prevents costly rewrites.

---

### VII. Observability & Monitoring

**Structured Logging**: Use Serilog or similar providers with structured logging. Log at appropriate levels (Trace, Debug, Info, Warning, Error, Critical). Include correlation IDs for request tracking.

**Telemetry**: Integrate with Application Insights or similar. Implement custom telemetry for business metrics. Monitor API performance, errors, and usage patterns.

**Health Checks**: Implement health checks and readiness probes for deployment environments. Monitor database connectivity, external dependencies, and critical services.

**Error Boundaries**: Implement React Error Boundaries for component-level error handling. Log errors appropriately for debugging. Provide fallback UI for error scenarios.

**Rationale**: Text I/O and structured logging ensure debuggability. Observability enables proactive issue detection. Monitoring provides insights for optimization and capacity planning.

---

### VIII. Code Quality & Maintainability

**Naming Conventions**: 
- **C#**: PascalCase for components/methods/public members, camelCase for private fields/local variables, prefix interfaces with "I" (e.g., `IUserService`)
- **React/TypeScript**: PascalCase for components, camelCase for functions/variables

**Formatting**: Apply `.editorconfig` rules. Use ESLint and Prettier for JavaScript/TypeScript. Ensure consistent indentation, spacing, and line breaks.

**Documentation**: Write clear, concise comments explaining WHY, not WHAT. Use JSDoc for complex functions. Document non-obvious design decisions. Keep README and docs current.

**Simplicity**: Follow YAGNI (You Aren't Gonna Need It). Start simple. Justify complexity in Complexity Tracking table. Avoid premature abstraction.

**Maintainability**: Write code with future maintainers in mind. Make design decisions explicit in comments. Handle edge cases. Write clear exception handling.

**Rationale**: Consistent style reduces friction. Good documentation preserves knowledge. Simplicity prevents technical debt. Maintainable code has lower total cost of ownership.

---

## Technology Stack

### Backend
- **Language**: C# 14
- **Framework**: .NET 8+, ASP.NET Core Minimal APIs
- **Data Access**: Entity Framework Core 8+
- **Database**: PostgreSQL (production), SQLite or In-Memory (development/testing)
- **Testing**: xUnit/NUnit/MSTest with Playwright for integration tests
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

### Frontend (When Applicable)
- **Language**: TypeScript (strict mode)
- **Framework**: React 19+ with Hooks
- **Build Tool**: Vite or Create React App
- **State Management**: React Context, Redux Toolkit, or Zustand (based on complexity)
- **Data Fetching**: React Query or SWR
- **Styling**: CSS Modules, Styled Components, or CSS-in-JS
- **Testing**: React Testing Library + Jest
- **Accessibility**: WCAG 2.1 AA compliance

---

## Development Workflow

### Code Review Requirements
- All PRs MUST pass automated tests
- MUST verify constitution compliance
- MUST check for security vulnerabilities
- MUST validate test coverage for critical paths
- Review for accessibility compliance (frontend)
- Verify proper error handling and logging

### Quality Gates
- All tests pass (unit, integration, contract)
- No critical security vulnerabilities
- Code formatting passes linting
- API documentation current
- Constitution principles followed (with justified exceptions in Complexity Tracking)

### Deployment Standards
- Containerize using .NET's built-in container support or Docker
- Implement health checks for orchestration
- Use environment-specific configuration
- Implement CI/CD pipelines
- Deploy to Azure App Service, Container Apps, or equivalent

---

## Governance

### Amendment Process
1. Propose amendment with rationale and impact analysis
2. Document affected templates and code
3. Gain approval from project stakeholders
4. Update constitution with incremented version
5. Create migration plan for existing code
6. Update all dependent templates and documentation
7. Communicate changes to team

### Versioning Policy
- **MAJOR**: Backward-incompatible governance changes, principle removals, or fundamental redefinitions
- **MINOR**: New principles added, existing principles materially expanded, new mandatory sections
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

### Compliance Review
- All PRs/code reviews MUST verify compliance with principles
- Violations MUST be documented in plan.md Complexity Tracking table
- Complexity MUST be justified with "Why Needed" and "Simpler Alternative Rejected Because"
- Constitution supersedes all other practices unless explicitly documented exception
- Use runtime guidance in README.md and docs/ for development guidance

### Constitution Supremacy
This constitution establishes the governance framework and core principles for the Customers API project. When conflicts arise between this document and other project documentation, the constitution takes precedence unless an explicit, documented exception has been approved through the amendment process.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
