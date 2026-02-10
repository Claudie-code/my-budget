import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activateEnvelope, createEnvelope, deleteEnvelope } from '@/api/envelopes.api';
import { toast } from 'sonner';

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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (response.action === 'DEACTIVATED') {
        toast.success('Envelope has expenses and has been deactivated instead of deleted');
      }

      if (response.action === 'DELETED') {
        toast.success('Envelope deleted');
      }
    },
  });
};

export const useActivateEnvelope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateEnvelope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Envelope reactivated');
    },
    onError: () => toast.error('Failed to reactivate envelope'),
  });
};
