import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { useState } from 'react';
import { set } from 'zod';

interface Props {
  envelopeId: number;
  name: string;
  budget: number;
}

export function EditEnvelopeButton({ envelopeId, name, budget }: Props) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState(name);
  const [newBudget, setNewBudget] = useState(budget);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/envelopes/${envelopeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newName, budget: newBudget }),
      });

      if (!res.ok) throw new Error('Update failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      setOpen(false);
      toast.success('Envelope updated');
    },
    onError: () => toast.error('Update failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newBudget <= 0) return;
    mutation.mutate();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Envelope description"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            min={0}
            required
          />

          <Input
            type="number"
            placeholder="Budget"
            value={newBudget}
            onChange={(e) => setNewBudget(Number(e.target.value))}
            required
          />

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Updating...' : 'Update envelope'}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
