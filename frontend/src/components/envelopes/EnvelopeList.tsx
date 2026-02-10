import type { Envelope } from '@/types/dashboard';
import { Progress } from '@/components/ui/progress';
import { Field, FieldLabel } from '../ui/field';

interface EnvelopeListProps {
  envelopes?: Envelope[];
  selectedEnvelopeId?: number;
  handleSelectEnvelope: (id: number) => void;
}

export default function EnvelopeList({
  envelopes,
  selectedEnvelopeId,
  handleSelectEnvelope,
}: EnvelopeListProps) {
  if (!envelopes || !envelopes.length)
    return <p className="text-gray-500 text-center mt-4">No envelopes yet</p>;

  return (
    <div className="overflow-y-auto flex flex-col gap-2">
      {envelopes.map((envelope) => {
        const spent = envelope.expenses.reduce((acc, e) => acc + e.amount, 0);
        const remaining = envelope.budget - spent;
        const percentUsed = envelope.budget > 0 ? (spent / envelope.budget) * 100 : 0;
        const isSelected = selectedEnvelopeId === envelope.id;

        return (
          <Field
            key={envelope.id}
            className={`cursor-pointer py-4 px-6 gap-1 text-gray-600 transition ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-100'}`}
            onClick={() => handleSelectEnvelope(envelope.id)}
          >
            <FieldLabel htmlFor={`progress-${envelope.id}`} className="cursor-pointer">
              <span>{envelope.name}</span>
              <span className="ml-auto">
                {remaining.toFixed(2)} / {envelope.budget.toFixed(2)} $
              </span>
            </FieldLabel>
            <Progress value={percentUsed} className={`h-1`} id={`progress-${envelope.id}`} />
          </Field>
        );
      })}
    </div>
  );
}
