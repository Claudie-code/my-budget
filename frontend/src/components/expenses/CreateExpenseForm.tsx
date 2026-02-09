import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CirclePlus } from 'lucide-react';
import { useCreateExpense } from '@/hooks/use-expenses';

interface Props {
  envelopeId: number;
}

export function AddExpenseDialog({ envelopeId }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;
    mutate(
      { description, amount, envelopeId },
      {
        onSuccess: () => {
          setDescription('');
          setAmount(0);
          setOpen(false);
        },
        onError: () => toast.error('Failed to add expense'),
      },
    );
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add expense'}
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
