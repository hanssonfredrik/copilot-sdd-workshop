# Data Model: Customer Admin Interface

**Feature**: Customer Admin Interface  
**Created**: December 4, 2025  
**Purpose**: Define entities, relationships, validation rules, and state transitions

---

## Entity: Customer

### Description
Represents an individual customer with contact information and address details. Customers are the primary entity managed through the admin interface.

### Attributes

| Attribute | Type | Required | Unique | Validation Rules | Notes |
|-----------|------|----------|--------|------------------|-------|
| `Id` | Integer | Yes (auto) | Yes | Auto-generated primary key | Set by database |
| `Name` | String | Yes | No | 1-200 characters, non-empty | Full name of customer |
| `Email` | String | Yes | Yes | Valid email format, max 254 chars | Must contain @ and valid domain |
| `Phone` | String | Yes | No | Valid E.164 format, 10-15 digits | International format with country code |
| `Street` | String | No | No | Max 200 characters | Optional address line |
| `City` | String | No | No | Max 100 characters | Optional city |
| `State` | String | No | No | Max 100 characters | State/Province/Region |
| `PostalCode` | String | No | No | Max 20 characters | Zip/Postal code |
| `Country` | String | No | No | Max 100 characters | Country name |
| `SignupDate` | DateTime | Yes (auto) | No | UTC timestamp | Auto-set on creation |

### Validation Rules

**Backend (C# / EF Core)**:
```csharp
[Required]
[StringLength(200, MinimumLength = 1)]
public string Name { get; set; }

[Required]
[EmailAddress]
[StringLength(254)]
public string Email { get; set; }

[Required]
[Phone]
[StringLength(15, MinimumLength = 10)]
public string Phone { get; set; }

[StringLength(200)]
public string? Street { get; set; }

[StringLength(100)]
public string? City { get; set; }

[StringLength(100)]
public string? State { get; set; }

[StringLength(20)]
public string? PostalCode { get; set; }

[StringLength(100)]
public string? Country { get; set; }
```

**Frontend (TypeScript / Zod)**:
```typescript
const CustomerSchema = z.object({
  id: z.number().int().positive().optional(), // Optional for create
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email format").max(254),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone format"),
  street: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  signupDate: z.string().datetime().optional(), // ISO 8601 format
});

type Customer = z.infer<typeof CustomerSchema>;
```

### Business Rules

1. **Email Uniqueness** (FR-003):
   - Email must be unique across all customers
   - Case-insensitive comparison
   - Backend enforces via unique index on `Email` column
   - Frontend displays error if API returns 409 Conflict

2. **Required Fields** (FR-001, FR-011):
   - Name, Email, and Phone are mandatory
   - Address fields (Street, City, State, PostalCode, Country) are optional
   - Validation occurs on both frontend (immediate feedback) and backend (security)

3. **Phone Format** (Assumptions):
   - Follows E.164 international standard
   - Format: `+[country code][number]` (e.g., `+12025551234`)
   - Digits only after country code
   - 10-15 total digits

4. **Signup Date** (Auto-managed):
   - Set automatically on creation to current UTC time
   - Not editable by users
   - Used for sorting and filtering in customer list

### Relationships

- **None**: Customer is a standalone entity with no foreign key relationships in current scope
- **Future**: May relate to Orders, Invoices, or other entities (out of scope)

### State Transitions

```
[Non-existent] 
    |
    | CREATE (POST /customers)
    v
[Active Customer]
    |
    | UPDATE (PUT /customers/{id})
    | (can update Name, Email, Phone, Address fields)
    v
[Active Customer (modified)]
    |
    | DELETE (DELETE /customers/{id})
    v
[Soft Deleted] (if using soft delete)
OR
[Permanently Removed] (if using hard delete)
```

**State Transition Rules**:

1. **Creation**:
   - Requires all mandatory fields (Name, Email, Phone)
   - Email must not exist in system (unique constraint)
   - SignupDate set automatically
   - Id assigned by database

2. **Update**:
   - Can modify any field except Id and SignupDate
   - Email uniqueness still enforced (can't change to existing email)
   - All validation rules apply to updated values
   - Concurrent updates handled by "last write wins" (no optimistic locking in V1)

3. **Deletion**:
   - Requires confirmation from user (FR-010)
   - Soft delete preferred (mark as deleted, don't remove data) - per Assumptions
   - Deleted customers don't appear in search or list results
   - Deletion is idempotent (deleting non-existent customer returns 404)

---

## Entity: Admin User (Conceptual)

### Description
Represents staff members who use the admin interface. **Note**: Authentication and user management are out of scope for this feature (handled by external system per spec Assumptions).

### Attributes (Conceptual)
- User ID (from auth system)
- Display Name
- Roles/Permissions (assumed: full access to customer management)

### Relationship to Customer
- **One-to-Many**: One admin can manage many customers
- **Tracking**: Not tracked in this feature (no audit trail or "created by" field)
- **Future**: Could add `CreatedBy`, `UpdatedBy` fields for audit purposes

---

## Data Flow Diagrams

### Create Customer Flow

```
Admin Interface (React)
    |
    | 1. User fills form
    | 2. Frontend validates (Zod schema)
    v
[Form Valid?] --No--> Show inline errors
    |
    | Yes
    v
POST /customers
    |
    | 3. Backend validates (Data Annotations)
    | 4. Check email uniqueness
    v
[Valid & Unique?] --No--> Return 400/409 + error details
    |
    | Yes
    v
Insert into Database
    |
    | 5. Generate Id, set SignupDate
    v
Return 201 Created + Customer object
    |
    | 6. React Query invalidates cache
    v
Admin sees success + new customer in list
```

### Search Customers Flow

```
Admin Interface (React)
    |
    | 1. User enters search term
    | 2. Debounced input (300ms)
    v
GET /customers?name={term}&page=1&pageSize=50
    |
    | 3. Backend queries database
    | 4. Case-insensitive search on Name, Email, Phone
    v
Return 200 OK + paginated results
    |
    | 5. React Query caches results
    v
Admin sees matching customers in table
```

### Edit Customer Flow

```
Admin Interface (React)
    |
    | 1. User clicks Edit on customer
    | 2. Load customer detail (GET /customers/{id})
    | 3. Pre-fill form with existing data
    v
User modifies fields
    |
    | 4. Frontend validates (Zod schema)
    v
[Form Valid?] --No--> Show inline errors
    |
    | Yes
    v
PUT /customers/{id}
    |
    | 5. Backend validates
    | 6. Check email uniqueness (if email changed)
    v
[Valid & Unique?] --No--> Return 400/409 + error details
    |
    | Yes
    v
Update database record
    |
    | 7. React Query invalidates cache
    v
Return 204 No Content
    |
    v
Admin sees success + updated info
```

### Delete Customer Flow

```
Admin Interface (React)
    |
    | 1. User clicks Delete on customer
    v
Show confirmation modal
    |
    | 2. User confirms or cancels
    v
[Confirmed?] --No--> Close modal, no action
    |
    | Yes
    v
DELETE /customers/{id}
    |
    | 3. Backend marks as deleted (soft delete)
    |    OR removes record (hard delete)
    v
[Customer exists?] --No--> Return 404
    |
    | Yes
    v
Remove/mark deleted in database
    |
    | 4. React Query removes from cache
    v
Return 204 No Content
    |
    v
Admin sees success + customer removed from list
```

---

## Database Schema Changes

**Current Schema** (from existing Customers.Api):
```sql
CREATE TABLE Customers (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(200) NOT NULL,
    City NVARCHAR(100),
    SignupDate DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

**Required Schema Changes**:
```sql
ALTER TABLE Customers
    ADD Email NVARCHAR(254) NOT NULL,
    ADD Phone NVARCHAR(15) NOT NULL,
    ADD Street NVARCHAR(200),
    ADD State NVARCHAR(100),
    ADD PostalCode NVARCHAR(20),
    ADD Country NVARCHAR(100);

CREATE UNIQUE INDEX IX_Customers_Email ON Customers(Email);

-- If soft delete approach:
-- ADD IsDeleted BIT NOT NULL DEFAULT 0,
-- ADD DeletedAt DATETIME2;
```

**Migration Notes**:
- Existing customers will need default values for new required fields (Email, Phone)
- Option 1: Make fields nullable initially, then backfill and make required
- Option 2: Add with defaults (e.g., "unknown@example.com") then manually update
- Unique email constraint requires all existing emails to be unique before applying

---

## Validation Error Messages

### Frontend Error Messages (User-Friendly)

| Validation | Error Message |
|------------|---------------|
| Name empty | "Name is required" |
| Name too long | "Name must be 200 characters or less" |
| Email empty | "Email is required" |
| Email invalid format | "Please enter a valid email address" |
| Email too long | "Email must be 254 characters or less" |
| Email duplicate | "This email is already in use by another customer" |
| Phone empty | "Phone number is required" |
| Phone invalid format | "Please enter a valid phone number (e.g., +12025551234)" |
| Phone too short/long | "Phone number must be between 10 and 15 digits" |
| Field too long | "[Field] must be [max] characters or less" |

### Backend Error Responses

**400 Bad Request** - Validation errors:
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Email": ["The Email field is not a valid e-mail address."],
    "Phone": ["The Phone field is required."]
  }
}
```

**409 Conflict** - Email uniqueness violation:
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Email address already exists.",
  "status": 409,
  "detail": "A customer with email 'john@example.com' already exists in the system."
}
```

---

## Performance Considerations

### Indexing Strategy

| Column | Index Type | Rationale |
|--------|-----------|-----------|
| `Id` | Clustered (PK) | Primary lookup by ID |
| `Email` | Unique Non-Clustered | Enforce uniqueness, support search by email |
| `Name` | Non-Clustered | Support search by name (partial match) |
| `SignupDate` | Non-Clustered | Support sorting and date range filters |

### Query Optimization

- Search queries use `LIKE '%term%'` for partial matching (consider full-text search for large datasets)
- Pagination limits result sets to 50 records (configurable via query param)
- EF Core generates parameterized queries to prevent SQL injection
- Consider adding composite index on `(Name, Email)` if multi-field searches are common

---

## API Response Formats

### Single Customer
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

### Paginated Customer List
```json
{
  "total": 1523,
  "page": 1,
  "pageSize": 50,
  "items": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+12025551234",
      "city": "Springfield",
      "signupDate": "2025-12-04T10:30:00Z"
    }
    // ... 49 more items
  ]
}
```

---

## Summary

- **Primary Entity**: Customer with 10 attributes (3 required, 7 optional)
- **Key Constraint**: Email must be unique across all customers
- **State Transitions**: Create → Active → Update (repeatable) → Delete
- **Validation**: Two layers (frontend + backend) with clear error messages
- **Performance**: Indexed columns for efficient search and retrieval
- **Database Changes**: 6 new columns + unique index on Email
