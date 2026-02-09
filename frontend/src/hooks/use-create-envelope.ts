import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEnvelope } from '@/api/envelopes.api';

export const useCreateEnvelope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEnvelope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
