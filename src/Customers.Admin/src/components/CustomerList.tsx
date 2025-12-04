import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteCustomer } from '../hooks/useCustomers';
import { ConfirmDialog } from './ConfirmDialog';
import { Toast } from './Toast';
import type { Customer } from '../types/customer';
import type { ToastType } from './Toast';
import styles from './CustomerList.module.css';

interface CustomerListProps {
  customers: Customer[];
  isLoading?: boolean;
}

export function CustomerList({ customers, isLoading }: CustomerListProps) {
  const navigate = useNavigate();
  const deleteCustomer = useDeleteCustomer();

  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const customerId = deleteTarget.id;
    const customerName = deleteTarget.name;
    setDeleteTarget(null);

    try {
      await deleteCustomer.mutateAsync(customerId);
      setToast({ message: `${customerName} deleted successfully!`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete customer. Please try again.', type: 'error' });
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading customers...</div>;
  }

  if (customers.length === 0) {
    return <div className={styles.empty}>No customers found</div>;
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Signup Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className={styles.row}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || '—'}</td>
                <td>{customer.city || '—'}</td>
                <td>{new Date(customer.signupDate).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${customer.id}`);
                      }}
                      className={styles.actionButton}
                      aria-label={`View ${customer.name}`}
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${customer.id}/edit`);
                      }}
                      className={styles.actionButton}
                      aria-label={`Edit ${customer.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(customer);
                      }}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      aria-label={`Delete ${customer.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
