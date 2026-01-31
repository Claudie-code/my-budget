import { Button } from '@/components/ui/button';
import type { Envelope } from '@/pages/Dashboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
  envelopeId: number;
}

export function DeleteEnvelopeButton({ envelopeId }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/envelopes/${envelopeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete envelope');
      }
    },
    // 🔮 Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['envelopes'] });

      const previous = queryClient.getQueryData<Envelope[]>(['envelopes']);

      queryClient.setQueryData<Envelope[]>(['envelopes'], (old) =>
        old ? old.filter((e) => e.id !== envelopeId) : [],
      );

      return { previous };
    },

    // 🔄 Rollback on error
    onError: (_err, _envelopeId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['envelopes'], context.previous);
      }
      toast.error('Delete failed');
    },

    // ✅ Feedback user
    onSuccess: () => {
      toast.success('Envelope deleted');
    },

    // 🔄 Refetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
    },
  });

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      Delete Envelope
    </Button>
  );
}
