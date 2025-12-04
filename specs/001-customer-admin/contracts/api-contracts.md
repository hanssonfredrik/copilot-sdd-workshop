# API Contracts: Customer Admin Interface

**Feature**: Customer Admin Interface  
**Created**: December 4, 2025  
**Base URL**: `http://localhost:5000` (development) / `https://api.example.com` (production)

---

## Overview

This document describes the REST API contracts for the Customer Management system. The admin interface will consume these endpoints to perform CRUD operations on customer records.

**Authentication**: All endpoints assume authentication is handled externally (per spec Assumptions). No auth headers documented here.

**Content Type**: All requests and responses use `application/json` unless otherwise specified.

**Error Handling**: All endpoints follow RFC 7807 Problem Details format for errors.

---

## Endpoints Summary

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/customers` | List/search customers (paginated) | 200 OK |
| GET | `/customers/{id}` | Get single customer by ID | 200 OK, 404 Not Found |
| POST | `/customers` | Create new customer | 201 Created, 400 Bad Request, 409 Conflict |
| PUT | `/customers/{id}` | Update existing customer | 204 No Content, 400 Bad Request, 404 Not Found, 409 Conflict |
| DELETE | `/customers/{id}` | Delete customer | 204 No Content, 404 Not Found |

---

## GET /customers

**Description**: Retrieve a paginated list of customers with optional filtering.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `pageSize` | integer | No | 50 | Number of records per page (max 100) |
| `name` | string | No | - | Filter by name (partial match, case-insensitive) |
| `email` | string | No | - | Filter by email (exact match, case-insensitive) |
| `phone` | string | No | - | Filter by phone (exact match) |
| `city` | string | No | - | Filter by city (exact match) |
| `from` | datetime | No | - | Filter by signup date (on or after) - ISO 8601 |
| `to` | datetime | No | - | Filter by signup date (on or before) - ISO 8601 |

**Request Example**:
```http
GET /customers?page=1&pageSize=50&name=john HTTP/1.1
Host: localhost:5000
Accept: application/json
```

**Response 200 OK**:
```json
{
  "total": 1523,
  "page": 1,
  "pageSize": 50,
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+12025551234",
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "postalCode": "62701",
      "country": "USA",
      "signupDate": "2025-12-04T10:30:00Z"
    },
    {
      "id": 2,
      "name": "John Smith",
      "email": "john.smith@example.com",
      "phone": "+14155559876",
      "street": null,
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94102",
      "country": "USA",
      "signupDate": "2025-12-03T14:22:00Z"
    }
  ]
}
```

**Response Schema**:
```typescript
{
  total: number;        // Total number of customers matching filter
  page: number;         // Current page number
  pageSize: number;     // Number of items per page
  items: Customer[];    // Array of customer objects
}
```

**Notes**:
- Returns empty array `[]` if no customers found (not 404)
- Search is case-insensitive for `name`, `email`, `city`
- Partial match supported only for `name` parameter
- Results sorted by `signupDate` descending (newest first)

---

## GET /customers/{id}

**Description**: Retrieve a single customer by unique ID.

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Customer unique identifier |

**Request Example**:
```http
GET /customers/123 HTTP/1.1
Host: localhost:5000
Accept: application/json
```

**Response 200 OK**:
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+12025551234",
  "street": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "postalCode": "62701",
  "country": "USA",
  "signupDate": "2025-12-04T10:30:00Z"
}
```

**Response 404 Not Found**:
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Not Found",
  "status": 404,
  "detail": "Customer with ID 123 was not found."
}
```

**Response Schema**:
```typescript
Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  signupDate: string;  // ISO 8601 datetime
}
```

---

## POST /customers

**Description**: Create a new customer.

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+13105551111",
  "street": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90001",
  "country": "USA"
}
```

**Request Schema**:
```typescript
{
  name: string;           // Required, 1-200 chars
  email: string;          // Required, valid email, max 254 chars, unique
  phone: string;          // Required, E.164 format, 10-15 digits
  street?: string;        // Optional, max 200 chars
  city?: string;          // Optional, max 100 chars
  state?: string;         // Optional, max 100 chars
  postalCode?: string;    // Optional, max 20 chars
  country?: string;       // Optional, max 100 chars
}
```

**Note**: `id` and `signupDate` are auto-generated and should NOT be included in request.

**Response 201 Created**:
```http
HTTP/1.1 201 Created
Location: /customers/124
Content-Type: application/json
```
```json
{
  "id": 124,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+13105551111",
  "street": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90001",
  "country": "USA",
  "signupDate": "2025-12-04T15:45:30Z"
}
```

**Response 400 Bad Request** (Validation Error):
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Name": ["The Name field is required."],
    "Email": ["The Email field is not a valid e-mail address."],
    "Phone": ["The Phone field must match the pattern '^\\+?[1-9]\\d{9,14}$'."]
  }
}
```

**Response 409 Conflict** (Duplicate Email):
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Email address already exists.",
  "status": 409,
  "detail": "A customer with email 'jane.doe@example.com' already exists in the system."
}
```

**Validation Rules**:
- `name`: Required, 1-200 characters
- `email`: Required, valid email format, max 254 characters, must be unique (case-insensitive)
- `phone`: Required, E.164 format (`+[country][number]`), 10-15 total digits
- All address fields: Optional, max lengths as specified

---

## PUT /customers/{id}

**Description**: Update an existing customer. All fields except `id` and `signupDate` can be updated.

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Customer unique identifier |

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+13105559999",
  "street": "789 Pine St",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90002",
  "country": "USA"
}
```

**Request Schema**: Same as POST /customers (all updatable fields must be provided)

**Response 204 No Content**:
```http
HTTP/1.1 204 No Content
```
(Empty body - update successful)

**Response 400 Bad Request** (Validation Error):
Same format as POST endpoint.

**Response 404 Not Found**:
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Not Found",
  "status": 404,
  "detail": "Customer with ID 999 was not found."
}
```

**Response 409 Conflict** (Duplicate Email):
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Email address already exists.",
  "status": 409,
  "detail": "A customer with email 'jane.smith@example.com' already exists in the system."
}
```

**Notes**:
- Email uniqueness check excludes the current customer (can re-save with same email)
- Cannot update `id` or `signupDate` - these are read-only
- All required fields must be provided (not a PATCH endpoint)
- Concurrent updates: Last write wins (no optimistic locking in V1)

---

## DELETE /customers/{id}

**Description**: Delete a customer. Soft delete is preferred (mark as deleted) but hard delete is also acceptable per spec.

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Customer unique identifier |

**Request Example**:
```http
DELETE /customers/123 HTTP/1.1
Host: localhost:5000
```

**Response 204 No Content**:
```http
HTTP/1.1 204 No Content
```
(Empty body - deletion successful)

**Response 404 Not Found**:
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Not Found",
  "status": 404,
  "detail": "Customer with ID 123 was not found."
}
```

**Notes**:
- Idempotent: Deleting same customer twice returns 404 on second attempt
- No confirmation required at API level (confirmation handled in UI per FR-010)
- Soft delete preferred: Add `IsDeleted` flag and filter queries
- Deleted customers should not appear in GET /customers results

---

## Error Response Format

All error responses follow **RFC 7807 Problem Details** format:

```typescript
{
  type: string;      // URI reference to error type documentation
  title: string;     // Short, human-readable summary of error
  status: number;    // HTTP status code
  detail?: string;   // Human-readable explanation of this specific error
  errors?: {         // Validation errors (400 responses only)
    [field: string]: string[];
  };
}
```

**Common HTTP Status Codes**:

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 OK | Success (with response body) | GET requests |
| 201 Created | Resource created | POST /customers |
| 204 No Content | Success (no response body) | PUT /customers, DELETE /customers |
| 400 Bad Request | Validation error | Invalid request data |
| 404 Not Found | Resource not found | GET/PUT/DELETE non-existent customer |
| 409 Conflict | Business rule violation | Duplicate email |
| 500 Internal Server Error | Unexpected server error | Database failures, etc. |

---

## Data Types

### Customer Type (TypeScript)
```typescript
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  signupDate: string; // ISO 8601 datetime (UTC)
}
```

### CreateCustomerRequest Type (TypeScript)
```typescript
interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
```

### UpdateCustomerRequest Type (TypeScript)
```typescript
// Same as CreateCustomerRequest
type UpdateCustomerRequest = CreateCustomerRequest;
```

### PaginatedCustomerResponse Type (TypeScript)
```typescript
interface PaginatedCustomerResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Customer[];
}
```

---

## Implementation Notes

### Frontend Implementation
- Use `/customers` endpoint with query params for search functionality
- Implement debouncing (300ms) for search input to reduce API calls
- Use React Query's `useQuery` for GET operations
- Use React Query's `useMutation` for POST, PUT, DELETE operations
- Invalidate `['customers']` query cache after mutations for automatic refresh

### Backend Implementation (Current State)
- Existing API already implements all CRUD endpoints
- **REQUIRED CHANGES**: Extend `Customer` model with new fields (email, phone, address)
- **REQUIRED CHANGES**: Add validation attributes to model
- **REQUIRED CHANGES**: Add unique index on `Email` column
- **REQUIRED CHANGES**: Update endpoints to handle new fields
- **REQUIRED CHANGES**: Implement email uniqueness check with 409 response

### Testing Contracts
- Write contract tests for each endpoint
- Verify request/response schemas match specification
- Test all error scenarios (400, 404, 409)
- Validate pagination logic with large datasets
- Test search functionality with various filter combinations

---

## OpenAPI/Swagger Documentation

The existing Customers API includes Swagger UI at `/swagger`. After implementing the required changes, the OpenAPI specification will be automatically generated and available at:

- **Swagger UI**: `http://localhost:5000/swagger`
- **OpenAPI JSON**: `http://localhost:5000/swagger/v1/swagger.json`

Ensure all endpoints are properly documented with:
- XML doc comments on endpoint methods
- `[ProducesResponseType]` attributes for all status codes
- Example request/response bodies
- Parameter descriptions

---

## Summary

- **5 Endpoints**: List, Get, Create, Update, Delete
- **REST Principles**: Proper HTTP verbs and status codes
- **Pagination**: Default 50 records per page, max 100
- **Search**: Filter by name (partial), email, phone, city, date range
- **Validation**: Two layers (frontend + backend)
- **Error Handling**: RFC 7807 Problem Details format
- **Required Backend Changes**: Extend Customer model, add email uniqueness constraint
