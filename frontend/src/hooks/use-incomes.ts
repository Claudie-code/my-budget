import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncome, deleteIncome, updateIncome } from '@/api/incomes.api';
import { toast } from 'sonner';

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Income added');
    },
    onError: () => toast.error('Failed to add income'),
  });
};

export const useEditIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Income updated');
    },
    onError: () => toast.error('Failed to update income'),
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Income deleted');
    },
    onError: () => toast.error('Failed to delete income'),
  });
};
