import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../services/customersApi';
import type { CreateCustomerRequest, UpdateCustomerRequest, GetCustomersParams } from '../types/customer';

export function useCustomers(params: GetCustomersParams = {}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.getCustomers(params),
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.getCustomer(id),
    enabled: id > 0,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customersApi.createCustomer(data),
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerRequest) => customersApi.updateCustomer(id, data),
    onSuccess: () => {
      // Invalidate both the specific customer and the list
      queryClient.invalidateQueries({ queryKey: ['customers', id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => customersApi.deleteCustomer(id),
    onSuccess: (_data, id) => {
      // Remove the specific customer from cache
      queryClient.removeQueries({ queryKey: ['customers', id] });
      // Invalidate the list to refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
