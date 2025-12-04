import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginatedCustomerResponse,
} from '../types/customer';

const API_BASE = '/customers';

export interface GetCustomersParams {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  from?: string;
  to?: string;
}

export const customersApi = {
  async getCustomers(params: GetCustomersParams = {}): Promise<PaginatedCustomerResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return response.json();
  },

  async getCustomer(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Customer not found');
      }
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }

    return response.json();
  },

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  async updateCustomer(id: number, data: UpdateCustomerRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  },

  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Customer not found');
      }
      throw new Error(`Failed to delete customer: ${response.statusText}`);
    }
  },
};
