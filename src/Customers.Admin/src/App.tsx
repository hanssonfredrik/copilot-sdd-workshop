import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import './App.css';

// Lazy load page components for code splitting
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const CreateCustomerPage = lazy(() => import('./pages/CreateCustomerPage'));
const CustomerDetailPage = lazy(() => import('./pages/CustomerDetailPage'));
const EditCustomerPage = lazy(() => import('./pages/EditCustomerPage'));

// Loading fallback component
function PageLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px',
      color: '#666'
    }}>
      Loading...
    </div>
  );
}

function App() {
  // Use /admin basename in production, empty in development
  const basename = import.meta.env.PROD ? '/admin' : '/';
  
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route 
              index 
              element={
                <Suspense fallback={<PageLoader />}>
                  <CustomersPage />
                </Suspense>
              } 
            />
            <Route 
              path="new" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <CreateCustomerPage />
                </Suspense>
              } 
            />
            <Route 
              path=":id" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <CustomerDetailPage />
                </Suspense>
              } 
            />
            <Route 
              path=":id/edit" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <EditCustomerPage />
                </Suspense>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
