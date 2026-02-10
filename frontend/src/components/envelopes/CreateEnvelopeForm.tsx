import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CirclePlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateEnvelope } from '@/hooks/use-envelopes';

export default function CreateEnvelopeForm() {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateEnvelope();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || budget <= 0) return toast.error('Please enter a valid name and budget');

    mutate(
      { name, budget },
      {
        onSuccess: () => {
          toast.success('Envelope created!');
          setName('');
          setBudget(0);
          setOpen(false);
        },
        onError: () => {
          toast.error('Failed to create envelope');
        },
      },
    );
  };

  return (
    <>
      <div className="flex items-center">
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
                required
              />

              <Input
                type="number"
                placeholder="Monthly budget"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={0}
                required
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating...' : 'Add envelope'}
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
