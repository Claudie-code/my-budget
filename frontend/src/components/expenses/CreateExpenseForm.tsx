import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CirclePlus } from 'lucide-react';

interface Props {
  envelopeId: number;
}

export function AddExpenseDialog({ envelopeId }: Props) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);

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
      setOpen(false);
    },
    onError: () => toast.error('Failed to add expense'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;
    mutation.mutate();
  };

  return (
    <>
      <div className="flex items-center mb-3">
        <h2 className="text-lg mr-1 font-semibold text-gray-700">Expenses</h2>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition"
            >
              <CirclePlus className="h-4 w-4 text-orange-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Expense description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                min={0}
                required
              />

              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? 'Adding...' : 'Add expense'}
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
