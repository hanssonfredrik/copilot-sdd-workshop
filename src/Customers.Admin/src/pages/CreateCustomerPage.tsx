import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerForm } from '../components/CustomerForm';
import { Toast, type ToastType } from '../components/Toast';
import { useCreateCustomer } from '../hooks/useCustomers';
import type { CustomerFormData } from '../types/customer';
import styles from './CreateCustomerPage.module.css';

function CreateCustomerPage() {
  const navigate = useNavigate();
  const createCustomer = useCreateCustomer();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await createCustomer.mutateAsync(data);
      setToast({ message: 'Customer created successfully!', type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      const message = error.response?.status === 409
        ? 'A customer with this email already exists'
        : 'Failed to create customer. Please try again.';
      setToast({ message, type: 'error' });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Customer</h1>
      <CustomerForm
        onSubmit={handleSubmit}
        isSubmitting={createCustomer.isPending}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default CreateCustomerPage;
