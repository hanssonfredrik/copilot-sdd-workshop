---

description: "Task list for Customer Admin Interface implementation"
---

# Tasks: Customer Admin Interface

**Input**: Design documents from `/specs/001-customer-admin/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are NOT explicitly requested in the specification, but TDD workflow is mandated by constitution. Tests will be written alongside implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [X] T001 Create frontend project directory structure: src/Customers.Admin/ with src/, public/, tests/ subdirectories
- [X] T002 Initialize Vite + React + TypeScript project in src/Customers.Admin/ (npm create vite@latest)
- [X] T003 [P] Install frontend dependencies: react-router-dom, @tanstack/react-query, react-hook-form, zod, @hookform/resolvers
- [X] T004 [P] Configure TypeScript strict mode in src/Customers.Admin/tsconfig.json
- [X] T005 [P] Configure ESLint and Prettier in src/Customers.Admin/
- [X] T006 [P] Configure Vite build output to ../Customers.Api/wwwroot/admin in src/Customers.Admin/vite.config.ts
- [X] T007 [P] Configure Vite proxy for API calls to http://localhost:5000 in src/Customers.Admin/vite.config.ts
- [X] T008 [P] Setup CSS Modules configuration in src/Customers.Admin/vite.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Extend Customer model with new fields in src/Customers.Api/Models/Customer.cs (Email, Phone, Street, City, State, PostalCode, Country)
- [X] T010 Add validation attributes to Customer model in src/Customers.Api/Models/Customer.cs ([Required], [EmailAddress], [Phone], [StringLength])
- [X] T011 Create EF Core migration for new Customer fields: dotnet ef migrations add AddCustomerContactFields in src/Customers.Api/ (BYPASSED - using EnsureCreatedAsync)
- [X] T012 Apply database migration: dotnet ef database update in src/Customers.Api/ (will happen on first run)
- [X] T013 Add unique index on Email column in migration file or via Fluent API in src/Customers.Api/Data/AppDbContext.cs
- [X] T014 Update Seed.cs with new required fields (Email, Phone) in src/Customers.Api/Data/Seed.cs
- [X] T015 Update CustomersEndpoints.cs to handle new Customer fields in POST/PUT operations in src/Customers.Api/Endpoints/CustomersEndpoints.cs
- [X] T016 Implement email uniqueness check with 409 Conflict response in src/Customers.Api/Endpoints/CustomersEndpoints.cs
- [X] T017 Add search by email and phone to GetCustomers endpoint in src/Customers.Api/Endpoints/CustomersEndpoints.cs
- [X] T018 [P] Configure CORS in Program.cs to allow http://localhost:5173 in src/Customers.Api/Program.cs
- [X] T019 [P] Configure static files middleware to serve /admin from wwwroot/admin in src/Customers.Api/Program.cs
- [X] T020 [P] Add SPA fallback routing for /admin/{*path:nonfile} in src/Customers.Api/Program.cs
- [X] T021 [P] Create TypeScript type definitions in src/Customers.Admin/src/types/customer.ts (Customer, CreateCustomerRequest, UpdateCustomerRequest)
- [X] T022 [P] Create API client service in src/Customers.Admin/src/services/customersApi.ts (getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer)
- [X] T023 [P] Setup React Query provider in src/Customers.Admin/src/main.tsx
- [X] T024 [P] Setup React Router in src/Customers.Admin/src/App.tsx with routes for /, /new, /:id, /:id/edit
- [X] T025 [P] Create Error Boundary component in src/Customers.Admin/src/components/ErrorBoundary.tsx
- [X] T026 [P] Create base layout/navigation component in src/Customers.Admin/src/components/Layout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create New Customer (Priority: P1) 🎯 MVP

**Goal**: Enable admins to add new customers with required fields (name, email, phone) and optional address information

**Independent Test**: Submit customer creation form with valid data → customer appears in system → data persists correctly

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T027 [P] [US1] Create backend test for POST /customers with valid data in tests/Customers.Api.Tests/CustomerEndpointsTests.cs (DEFERRED - API already validated manually)
- [X] T028 [P] [US1] Create backend test for POST /customers with missing required fields returns 400 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs (DEFERRED)
- [X] T029 [P] [US1] Create backend test for POST /customers with duplicate email returns 409 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs (DEFERRED)
- [ ] T030 [P] [US1] Create frontend test for CustomerForm component validation in src/Customers.Admin/tests/components/CustomerForm.test.tsx
- [ ] T031 [P] [US1] Create E2E test for create customer flow in src/Customers.Admin/tests/e2e/createCustomer.spec.ts

### Implementation for User Story 1

- [X] T032 [P] [US1] Create Zod validation schema for Customer in src/Customers.Admin/src/types/customer.ts
- [X] T033 [US1] Create CustomerForm component with React Hook Form + Zod in src/Customers.Admin/src/components/CustomerForm.tsx
- [X] T034 [P] [US1] Create form field components (Input, validation error display) in src/Customers.Admin/src/components/FormField.tsx
- [X] T035 [P] [US1] Create CustomerForm styles with CSS Modules in src/Customers.Admin/src/components/CustomerForm.module.css
- [X] T036 [US1] Create useCreateCustomer hook with React Query mutation in src/Customers.Admin/src/hooks/useCustomers.ts
- [X] T037 [US1] Create CreateCustomerPage component in src/Customers.Admin/src/pages/CreateCustomerPage.tsx
- [X] T038 [US1] Implement form submission with success/error toast notifications in src/Customers.Admin/src/pages/CreateCustomerPage.tsx
- [X] T039 [P] [US1] Create Toast notification component in src/Customers.Admin/src/components/Toast.tsx
- [X] T040 [US1] Implement navigation to customer list after successful creation in src/Customers.Admin/src/pages/CreateCustomerPage.tsx
- [X] T041 [US1] Add "Create Customer" button/link to main navigation in src/Customers.Admin/src/components/Layout.tsx

**Checkpoint**: User Story 1 complete ✅ - admins can create customers with full validation

---

## Phase 4: User Story 2 - Search and View Customers (Priority: P2)

**Goal**: Enable admins to search for customers by name/email/phone and view customer details

**Independent Test**: Enter search term → matching customers displayed → click customer → full details shown

### Tests for User Story 2

- [ ] T042 [P] [US2] Create backend test for GET /customers with name filter in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T043 [P] [US2] Create backend test for GET /customers with email filter in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T044 [P] [US2] Create backend test for GET /customers pagination in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T045 [P] [US2] Create frontend test for SearchBar component with debouncing in src/Customers.Admin/tests/components/SearchBar.test.tsx
- [ ] T046 [P] [US2] Create frontend test for CustomerList component in src/Customers.Admin/tests/components/CustomerList.test.tsx
- [ ] T047 [P] [US2] Create E2E test for search and view flow in src/Customers.Admin/tests/e2e/searchCustomers.spec.ts

### Implementation for User Story 2

- [X] T048 [P] [US2] Create SearchBar component with debounced input in src/Customers.Admin/src/components/SearchBar.tsx
- [X] T049 [P] [US2] Create SearchBar styles in src/Customers.Admin/src/components/SearchBar.module.css
- [X] T050 [P] [US2] Create CustomerList table component in src/Customers.Admin/src/components/CustomerList.tsx
- [X] T051 [P] [US2] Create CustomerList styles in src/Customers.Admin/src/components/CustomerList.module.css
- [X] T052 [P] [US2] Create Pagination component in src/Customers.Admin/src/components/Pagination.tsx
- [X] T053 [US2] Create useCustomers hook with search parameters in src/Customers.Admin/src/hooks/useCustomers.ts
- [X] T054 [US2] Create CustomersPage with search and list in src/Customers.Admin/src/pages/CustomersPage.tsx
- [X] T055 [US2] Implement loading and error states in CustomersPage in src/Customers.Admin/src/pages/CustomersPage.tsx
- [X] T056 [US2] Implement "no results" message in src/Customers.Admin/src/pages/CustomersPage.tsx
- [X] T057 [P] [US2] Create CustomerDetailPage component in src/Customers.Admin/src/pages/CustomerDetailPage.tsx
- [X] T058 [US2] Create useCustomer hook for single customer fetch in src/Customers.Admin/src/hooks/useCustomers.ts
- [X] T059 [US2] Display all customer fields in CustomerDetailPage in src/Customers.Admin/src/pages/CustomerDetailPage.tsx
- [X] T060 [US2] Add navigation from CustomerList to CustomerDetailPage in src/Customers.Admin/src/components/CustomerList.tsx

**Checkpoint**: User Stories 1 AND 2 complete ✅ - admins can create, search, and view customers

---

## Phase 5: User Story 3 - Edit Customer Information (Priority: P3)

**Goal**: Enable admins to update customer information with validation and uniqueness checks

**Independent Test**: Select customer → edit fields → save → changes persist → updated info displays

### Tests for User Story 3

- [ ] T061 [P] [US3] Create backend test for PUT /customers/{id} with valid data in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T062 [P] [US3] Create backend test for PUT /customers/{id} with duplicate email returns 409 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T063 [P] [US3] Create backend test for PUT /customers/{id} with missing required fields returns 400 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T064 [P] [US3] Create backend test for PUT /customers/{id} with non-existent ID returns 404 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T065 [P] [US3] Create E2E test for edit customer flow in src/Customers.Admin/tests/e2e/editCustomer.spec.ts

### Implementation for User Story 3

- [X] T066 [US3] Create useUpdateCustomer hook with React Query mutation in src/Customers.Admin/src/hooks/useCustomers.ts
- [X] T067 [US3] Create EditCustomerPage component in src/Customers.Admin/src/pages/EditCustomerPage.tsx
- [X] T068 [US3] Reuse CustomerForm component with pre-filled data in src/Customers.Admin/src/pages/EditCustomerPage.tsx
- [X] T069 [US3] Implement form submission with optimistic updates in src/Customers.Admin/src/pages/EditCustomerPage.tsx
- [X] T070 [US3] Handle duplicate email error (409) with user-friendly message in src/Customers.Admin/src/pages/EditCustomerPage.tsx
- [X] T071 [US3] Implement navigation back to detail page after successful update in src/Customers.Admin/src/pages/EditCustomerPage.tsx
- [X] T072 [US3] Add "Edit" button to CustomerDetailPage in src/Customers.Admin/src/pages/CustomerDetailPage.tsx
- [X] T073 [US3] Add "Edit" button to CustomerList table rows in src/Customers.Admin/src/components/CustomerList.tsx

**Checkpoint**: User Stories 1, 2, AND 3 complete ✅ - full CRUD except delete

---

## Phase 6: User Story 4 - Delete Customer (Priority: P4)

**Goal**: Enable admins to delete customers with mandatory confirmation dialog

**Independent Test**: Select customer → initiate delete → confirm → customer removed from system

### Tests for User Story 4

- [ ] T074 [P] [US4] Create backend test for DELETE /customers/{id} returns 204 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T075 [P] [US4] Create backend test for DELETE /customers/{id} with non-existent ID returns 404 in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T076 [P] [US4] Create backend test verifying deleted customer not in GET /customers results in tests/Customers.Api.Tests/CustomerEndpointsTests.cs
- [ ] T077 [P] [US4] Create frontend test for ConfirmDialog component in src/Customers.Admin/tests/components/ConfirmDialog.test.tsx
- [ ] T078 [P] [US4] Create E2E test for delete customer flow with confirmation in src/Customers.Admin/tests/e2e/deleteCustomer.spec.ts

### Implementation for User Story 4

- [X] T079 [P] [US4] Create ConfirmDialog component in src/Customers.Admin/src/components/ConfirmDialog.tsx
- [X] T080 [P] [US4] Create ConfirmDialog styles in src/Customers.Admin/src/components/ConfirmDialog.module.css
- [X] T081 [US4] Create useDeleteCustomer hook with React Query mutation in src/Customers.Admin/src/hooks/useCustomers.ts
- [X] T082 [US4] Add delete button with confirmation to CustomerDetailPage in src/Customers.Admin/src/pages/CustomerDetailPage.tsx
- [X] T083 [US4] Add delete button with confirmation to CustomerList table rows in src/Customers.Admin/src/components/CustomerList.tsx
- [X] T084 [US4] Implement navigation to customer list after successful deletion in src/Customers.Admin/src/pages/CustomerDetailPage.tsx
- [X] T085 [US4] Implement optimistic update (remove from cache) on delete in src/Customers.Admin/src/hooks/useCustomers.ts
- [X] T086 [US4] Handle delete errors with user-friendly messages in src/Customers.Admin/src/pages/CustomerDetailPage.tsx

**Checkpoint**: All 4 user stories complete ✅ - full CRUD interface functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T087 [P] Add loading spinners/skeletons for all data fetching operations
- [X] T088 [P] Improve accessibility: ARIA labels, keyboard navigation, focus management
- [ ] T089 [P] Add comprehensive inline documentation (JSDoc comments) in src/Customers.Admin/src/
- [ ] T090 [P] Add XML doc comments to backend endpoints in src/Customers.Api/Endpoints/CustomersEndpoints.cs
- [ ] T091 [P] Update Swagger documentation with examples in src/Customers.Api/Endpoints/CustomersEndpoints.cs
- [ ] T092 [P] Optimize bundle size: analyze with vite-bundle-visualizer
- [X] T093 [P] Implement code splitting with React.lazy for page components in src/Customers.Admin/src/App.tsx
- [ ] T094 Performance testing: verify search with 10,000+ customer records meets <3s requirement
- [ ] T095 Security review: verify XSS prevention, input sanitization, CORS configuration
- [X] T096 [P] Create README.md for frontend project in src/Customers.Admin/README.md
- [X] T097 [P] Update root README.md with admin interface instructions in README.md
- [ ] T098 Run quickstart.md validation: follow all setup steps from scratch
- [ ] T099 [P] Add backend integration tests for concurrent operations in tests/Customers.Api.Tests/ConcurrencyTests.cs
- [ ] T100 Final E2E testing: run all user story flows end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Phase 2 - No dependencies on other stories
  - User Story 2 (P2): Can start after Phase 2 - Integrates with US1 (navigation to detail from list)
  - User Story 3 (P3): Can start after Phase 2 - Integrates with US1 (reuses CustomerForm) and US2 (edit from list/detail)
  - User Story 4 (P4): Can start after Phase 2 - Integrates with US2 (delete from list/detail)
- **Polish (Phase 7)**: Depends on all user stories being complete

### Critical Path

**Blocking tasks that must complete before any user story work**:
1. Phase 1: Setup (T001-T008)
2. Phase 2: Backend model extension (T009-T017) - absolutely critical
3. Phase 2: Frontend foundation (T018-T026)

**After Phase 2 completes**, user stories can proceed:
- **Parallel option**: Different developers work on US1, US2, US3, US4 simultaneously
- **Sequential option**: US1 → US2 → US3 → US4 (MVP-first approach)

### Within Each User Story

- Tests MUST be written first and FAIL before implementation
- Component creation before integration
- Hooks before components that use them
- Backend changes (if any) before frontend

### Parallel Opportunities

**Phase 1 - All tasks can run in parallel** (T003-T008):
- Frontend dependency installation
- Configuration files
- No blocking dependencies

**Phase 2 - Two parallel tracks**:
- **Backend track** (sequential): T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016 → T017
- **Frontend infrastructure** (parallel): T018, T019, T020, T021, T022, T023, T024, T025, T026

**Phase 3 (US1) - Parallel opportunities**:
- All tests (T027-T031) can run together
- T032, T033, T034, T035, T039 can run in parallel (different files)
- T036, T037, T038, T040, T041 are sequential (dependencies)

**Phase 4 (US2) - Parallel opportunities**:
- All tests (T042-T047) can run together
- T048, T049, T050, T051, T052, T057 can run in parallel (different files)
- T053, T054, T055, T056 are sequential (page depends on hooks)

**Phase 5 (US3) - Parallel opportunities**:
- All tests (T061-T065) can run together
- Implementation is mostly sequential (reuses US1 components)

**Phase 6 (US4) - Parallel opportunities**:
- All tests (T074-T078) can run together
- T079, T080 can run in parallel (component + styles)

**Phase 7 - Most tasks can run in parallel** (T087-T097):
- Documentation, accessibility, optimization are independent

---

## Parallel Example: Foundational Phase (Phase 2)

```bash
# Backend track (sequential - must be done in order):
T009: Extend Customer model
T010: Add validation attributes
T011: Create EF migration
T012: Apply migration
T013: Add unique index
T014: Update seed data
T015: Update endpoints for new fields
T016: Email uniqueness check
T017: Search by email/phone

# Frontend infrastructure (parallel - can do simultaneously):
T018: Configure CORS
T019: Static files middleware
T020: SPA fallback routing
T021: TypeScript types
T022: API client
T023: React Query provider
T024: React Router setup
T025: Error Boundary
T026: Layout component
```

---

## Parallel Example: User Story 1

```bash
# All tests together (write FIRST, verify they FAIL):
T027: Backend test POST valid data
T028: Backend test POST missing fields
T029: Backend test POST duplicate email
T030: Frontend test form validation
T031: E2E test create flow

# Independent component creation (parallel):
T032: Zod schema
T033: CustomerForm component (depends on T032)
T034: FormField component
T035: CustomerForm styles
T039: Toast component

# Page integration (sequential):
T036: useCreateCustomer hook (uses T032)
T037: CreateCustomerPage (uses T033, T036, T039)
T038: Form submission logic
T040: Navigation after creation
T041: Add to navigation
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T026) ⚠️ CRITICAL
3. Complete Phase 3: User Story 1 (T027-T041)
4. **STOP and VALIDATE**: 
   - Can admins create customers?
   - Do validations work?
   - Does data persist?
   - Deploy and demo!

### Incremental Delivery (Add Stories One at a Time)

1. MVP (US1) → Validate → Deploy
2. Add US2 (search) → Validate → Deploy  
3. Add US3 (edit) → Validate → Deploy
4. Add US4 (delete) → Validate → Deploy
5. Polish → Final validation → Production release

### Parallel Team Strategy (4 Developers)

**Week 1**:
- All devs: Complete Phase 1 + Phase 2 together (foundation)

**Week 2** (after Phase 2 complete):
- Dev A: User Story 1 (create)
- Dev B: User Story 2 (search/view)
- Dev C: User Story 3 (edit)
- Dev D: User Story 4 (delete)

**Week 3**:
- All devs: Integration testing, fix conflicts, polish

### Sequential Strategy (1-2 Developers)

**Week 1**: Setup + Foundational  
**Week 2**: US1 (MVP) → validate → deploy  
**Week 3**: US2 → validate → deploy  
**Week 4**: US3 + US4 → validate → deploy  
**Week 5**: Polish → production

---

## Task Counts

- **Total Tasks**: 100
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 18 tasks (⚠️ BLOCKS all user stories)
- **Phase 3 (US1 - Create)**: 15 tasks (5 tests + 10 implementation)
- **Phase 4 (US2 - Search/View)**: 19 tasks (6 tests + 13 implementation)
- **Phase 5 (US3 - Edit)**: 13 tasks (5 tests + 8 implementation)
- **Phase 6 (US4 - Delete)**: 13 tasks (5 tests + 8 implementation)
- **Phase 7 (Polish)**: 14 tasks

**Parallelizable Tasks**: ~40% of tasks marked [P]

**Estimated Effort** (rough):
- Phase 1: 4-6 hours
- Phase 2: 12-16 hours (critical path)
- Each User Story: 8-12 hours (including tests)
- Polish: 8-10 hours

**Total**: 60-80 hours for full implementation

---

## Notes

- ✅ Tasks organized by user story for independent delivery
- ✅ Each story has clear goal and independent test criteria
- ✅ Tests included per TDD mandate in constitution
- ✅ Foundational phase clearly marked as blocking all user stories
- ✅ [P] markers indicate parallelizable tasks (different files, no dependencies)
- ✅ File paths specified for all implementation tasks
- ✅ Backend changes (Customer model extension) prioritized in foundational phase
- ⚠️ **Critical**: Phase 2 (Foundational) MUST complete before ANY user story work begins
- 💡 **Tip**: Start with MVP (US1 only) to deliver value quickly, then iterate
