import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { CustomerForm } from '../components/CustomerForm';
import { Toast } from '../components/Toast';
import type { CustomerFormData } from '../types/customer';
import type { ToastType } from '../components/Toast';
import styles from './EditCustomerPage.module.css';

function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);

  const { data: customer, isLoading, error } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer(customerId);

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await updateCustomer.mutateAsync(data);
      setToast({ message: 'Customer updated successfully!', type: 'success' });
      // Navigate back to detail page after brief delay
      setTimeout(() => {
        navigate(`/${customerId}`);
      }, 1500);
    } catch (err: unknown) {
      // Handle duplicate email error (409 Conflict)
      if (err && typeof err === 'object' && 'status' in err && err.status === 409) {
        setToast({ message: 'A customer with this email already exists.', type: 'error' });
      } else {
        setToast({ message: 'Failed to update customer. Please try again.', type: 'error' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading customer...</div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Failed to load customer. Please try again.
          <button onClick={() => navigate(`/${customerId}`)} className={styles.backButton}>
            Back to Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Edit Customer</h1>
        <button onClick={() => navigate(`/${customerId}`)} className={styles.cancelButton}>
          Cancel
        </button>
      </div>

      <CustomerForm
        onSubmit={handleSubmit}
        defaultValues={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          street: customer.street || '',
          city: customer.city || '',
          state: customer.state || '',
          postalCode: customer.postalCode || '',
          country: customer.country || '',
        }}
        isSubmitting={updateCustomer.isPending}
      />
    </div>
  );
}

export default EditCustomerPage;
