import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerFormData } from '../types/customer';
import { FormField } from './FormField';
import styles from './CustomerForm.module.css';

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  defaultValues?: Partial<CustomerFormData>;
  isSubmitting?: boolean;
}

export function CustomerForm({ onSubmit, defaultValues, isSubmitting = false }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Required Information</h3>
        <FormField
          label="Name"
          required
          {...register('name')}
          error={errors.name}
          disabled={isSubmitting}
        />
        <FormField
          label="Email"
          type="email"
          required
          {...register('email')}
          error={errors.email}
          disabled={isSubmitting}
        />
        <FormField
          label="Phone"
          type="tel"
          required
          {...register('phone')}
          error={errors.phone}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Address (Optional)</h3>
        <FormField
          label="Street"
          {...register('street')}
          error={errors.street}
          disabled={isSubmitting}
        />
        <div className={styles.row}>
          <FormField
            label="City"
            {...register('city')}
            error={errors.city}
            disabled={isSubmitting}
          />
          <FormField
            label="State"
            {...register('state')}
            error={errors.state}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.row}>
          <FormField
            label="Postal Code"
            {...register('postalCode')}
            error={errors.postalCode}
            disabled={isSubmitting}
          />
          <FormField
            label="Country"
            {...register('country')}
            error={errors.country}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Customer'}
        </button>
      </div>
    </form>
  );
}
