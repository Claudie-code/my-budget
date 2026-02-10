import { Button } from '@/components/ui/button';
import { useActivateEnvelope } from '@/hooks/use-envelopes';
import type { Envelope } from '@/types/dashboard';

interface InactiveEnvelopeItemProps {
  envelope: Envelope;
}

export default function InactiveEnvelopeItem({ envelope }: InactiveEnvelopeItemProps) {
  const { isPending, mutate } = useActivateEnvelope();

  return (
    <div className="flex justify-between items-center bg-gray-50 text-gray-400 py-4 px-6">
      <span className="font-medium">{envelope.name}</span>
      <Button size="sm" variant="outline" onClick={() => mutate(envelope.id)} disabled={isPending}>
        {isPending ? '...' : 'Reactivate'}
      </Button>
    </div>
  );
}
