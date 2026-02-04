import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CirclePlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function CreateEnvelopeForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [open, setOpen] = useState(false);

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
      setOpen(false);
    },
    onError: () => toast.error('Failed to create envelope'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || budget <= 0) return;
    createEnvelopeMutation.mutate();
  };

  return (
    <>
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-semibold mr-1">Envelopes</h2>

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
                placeholder="Envelope name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                min={0}
                required
              />

              <Input
                type="number"
                placeholder="Monthly budget"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
              />

              <Button type="submit" className="w-full" disabled={createEnvelopeMutation.isPending}>
                {createEnvelopeMutation.isPending ? 'Creating...' : 'Add envelope'}
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
