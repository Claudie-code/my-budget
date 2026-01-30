import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CreateEnvelopeFormProps {
  // Callback when an envelope is created
  onCreated?: () => void;
}

export default function CreateEnvelopeForm({ onCreated }: CreateEnvelopeFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<number>(0);

  const createEnvelopeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/envelopes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, budget }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create envelope');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      toast.success('Envelope created!');
      setName('');
      setBudget(0);
      if (onCreated) onCreated();
    },
    onError: () => toast.error('Failed to create envelope'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || budget <= 0) return;
    createEnvelopeMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        placeholder="Envelope name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        required
        min={0}
      />
      <Button type="submit" disabled={createEnvelopeMutation.isPending}>
        {createEnvelopeMutation.isPending ? 'Creating...' : 'Add Envelope'}
      </Button>
    </form>
  );
}
