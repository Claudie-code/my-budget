import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
  envelopeId: number;
}

export function AddExpenseDialog({ envelopeId }: Props) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          description,
          amount,
          envelopeId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add expense');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      toast.success('Expense added');
      setDescription('');
      setAmount(0);
    },
    onError: () => toast.error('Failed to add expense'),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Add Expense</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
