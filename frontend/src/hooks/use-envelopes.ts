import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEnvelope, deleteEnvelope } from '@/api/envelopes.api';

export const useCreateEnvelope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEnvelope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteEnvelope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEnvelope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
