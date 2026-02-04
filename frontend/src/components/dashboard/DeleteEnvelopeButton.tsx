import { Button } from '@/components/ui/button';
import type { Envelope } from '@/pages/Dashboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  envelopeId: number;
  setSelectedEnvelopeId: (envelopeId: number | null) => void;
}

export function DeleteEnvelopeButton({ envelopeId, setSelectedEnvelopeId }: Props) {
  const queryClient = useQueryClient();

  const deleteEnvelopeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/envelopes/${envelopeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete envelope');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      setSelectedEnvelopeId(null); // juste pour vider la sélection
      toast.success('Envelope deleted');
    },
    onError: () => toast.error('Delete failed'),
  });

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => deleteEnvelopeMutation.mutate()}
      disabled={deleteEnvelopeMutation.isPending}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
