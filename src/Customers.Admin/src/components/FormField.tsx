import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import styles from './FormField.module.css';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  required?: boolean;
}

export function FormField({ label, error, required, ...inputProps }: FormFieldProps) {
  const id = inputProps.id || inputProps.name;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <input
        {...inputProps}
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
