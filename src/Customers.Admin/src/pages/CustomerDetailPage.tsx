import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomer, useDeleteCustomer } from '../hooks/useCustomers';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import type { ToastType } from '../components/Toast';
import styles from './CustomerDetailPage.module.css';

function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);

  const { data: customer, isLoading, error } = useCustomer(customerId);
  const deleteCustomer = useDeleteCustomer();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    try {
      await deleteCustomer.mutateAsync(customerId);
      setToast({ message: 'Customer deleted successfully!', type: 'success' });
      // Navigate to list after brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setToast({ message: 'Failed to delete customer. Please try again.', type: 'error' });
    }
  };

  if (isLoading) {
    return <div className={styles.container}>
      <div className={styles.loading}>Loading customer details...</div>
    </div>;
  }

  if (error || !customer) {
    return <div className={styles.container}>
      <div className={styles.error}>
        Customer not found or failed to load.
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Back to List
        </button>
      </div>
    </div>;
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

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <div className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.backLink}>
          ← Back to List
        </button>
        <div className={styles.actions}>
          <Link to={`/${customer.id}/edit`} className={styles.editButton}>
            Edit Customer
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className={styles.deleteButton}
            disabled={deleteCustomer.isPending}
          >
            Delete Customer
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>{customer.name}</h1>
        <p className={styles.subtitle}>Customer ID: {customer.id}</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <div className={styles.value}>{customer.email}</div>
            </div>
            {customer.phone && (
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <div className={styles.value}>{customer.phone}</div>
              </div>
            )}
          </div>
        </div>

        {(customer.street || customer.city || customer.state || customer.postalCode) && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Address</h2>
            <div className={styles.grid}>
              {customer.street && (
                <div className={styles.field}>
                  <label className={styles.label}>Street Address</label>
                  <div className={styles.value}>{customer.street}</div>
                </div>
              )}
              {customer.city && (
                <div className={styles.field}>
                  <label className={styles.label}>City</label>
                  <div className={styles.value}>{customer.city}</div>
                </div>
              )}
              {customer.state && (
                <div className={styles.field}>
                  <label className={styles.label}>State</label>
                  <div className={styles.value}>{customer.state}</div>
                </div>
              )}
              {customer.postalCode && (
                <div className={styles.field}>
                  <label className={styles.label}>Postal Code</label>
                  <div className={styles.value}>{customer.postalCode}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
          <div className={styles.field}>
            <label className={styles.label}>Signup Date</label>
            <div className={styles.value}>
              {new Date(customer.signupDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailPage;
