import type { Envelope } from '@/pages/Dashboard';

interface EnvelopeListProps {
  envelopes?: Envelope[];
  setSelectedEnvelopeId: (envelopeId: number | null) => void;
  selectedEnvelopeId?: number;
}

export default function EnvelopeList({
  envelopes,
  setSelectedEnvelopeId,
  selectedEnvelopeId,
}: EnvelopeListProps) {
  if (!envelopes || !envelopes.length)
    return <p className="text-muted text-center mt-4">No envelopes yet</p>;

  return (
    <div className="overflow-y-auto">
      {envelopes.map((envelope) => {
        const totalAssigned = envelope.expenses.reduce((acc, e) => acc + e.amount, 0);
        const isSelected = selectedEnvelopeId === envelope.id;

        return (
          <div
            key={envelope.id}
            className={`flex justify-between items-center p-2 cursor-pointer rounded-md transition ${
              isSelected ? 'bg-orange-50 font-semibold' : 'hover:bg-muted/30'
            }`}
            onClick={() => setSelectedEnvelopeId(envelope.id)}
          >
            <span>{envelope.name}</span>
            <span className="text-orange-500">${(envelope.budget - totalAssigned).toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
}
