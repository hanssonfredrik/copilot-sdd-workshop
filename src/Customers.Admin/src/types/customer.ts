import { z } from 'zod';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  signupDate: string; // ISO 8601 datetime
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {}

export interface GetCustomersParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCustomerResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Customer[];
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Zod validation schema for customer form
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(254, 'Email must be 254 characters or less'),
  phone: z.string().min(1, 'Phone is required').max(15, 'Phone must be 15 characters or less'),
  street: z.string().max(200, 'Street must be 200 characters or less').optional().or(z.literal('')),
  city: z.string().max(100, 'City must be 100 characters or less').optional().or(z.literal('')),
  state: z.string().max(100, 'State must be 100 characters or less').optional().or(z.literal('')),
  postalCode: z.string().max(20, 'Postal code must be 20 characters or less').optional().or(z.literal('')),
  country: z.string().max(100, 'Country must be 100 characters or less').optional().or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
