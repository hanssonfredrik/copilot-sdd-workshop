# Customer Admin Interface

A modern React-based admin interface for managing customer records with full CRUD functionality.

## 🚀 Features

- **Create Customers**: Add new customers with required (name, email, phone) and optional (address) fields
- **Search & View**: Search customers by name/email/phone with pagination (50 records per page)
- **Edit Customers**: Update customer information with validation and email uniqueness checks
- **Delete Customers**: Remove customers with mandatory confirmation dialog
- **Real-time Validation**: Client-side validation with Zod schemas and React Hook Form
- **Toast Notifications**: Success/error feedback for all operations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite 7.2.6
- **Routing**: React Router v6
- **State Management**: TanStack Query v5 (React Query)
- **Forms**: React Hook Form + Zod validation
- **Styling**: CSS Modules with BEM conventions
- **Code Splitting**: React.lazy for optimized bundle loading

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server (with API proxy)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Setup

**Development Mode** (Vite dev server):
- Frontend: `http://localhost:5173`
- API Proxy: `/customers` → `http://localhost:5000/customers`

**Production Mode**:
- Served from: `http://localhost:5000/admin`
- Build output: `../Customers.Api/wwwroot/admin`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── pages/               # Route-level components (lazy loaded)
├── services/            # API client
├── types/               # TypeScript type definitions
└── App.tsx              # Main app with routing
```

## 🎯 Performance

### Bundle Size (Production)
- **JavaScript**: ~354 KB (~110 KB gzipped)
- **CSS**: ~11 KB (~2.8 KB gzipped)

### Optimizations
- ✅ Code splitting with React.lazy
- ✅ React Query caching
- ✅ Debounced search (300ms)
- ✅ CSS Modules (scoped styles)

## ♿ Accessibility

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management in dialogs
- ✅ Semantic HTML structure

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output: ../Customers.Api/wwwroot/admin/
```

The build output is served by the ASP.NET Core backend from the `/admin` route.
