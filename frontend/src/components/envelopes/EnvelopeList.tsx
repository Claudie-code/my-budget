import { Progress } from '@/components/ui/progress';
import { Field, FieldLabel } from '../ui/field';
import InactiveEnvelopeItem from './InactiveEnvelopeItem';
import { useEnvelopes } from '@/providers/EnvelopesProvider';

interface EnvelopeListProps {
  selectedEnvelopeId?: number;
  handleSelectEnvelope: (id: number) => void;
}

export default function EnvelopeList({
  selectedEnvelopeId,
  handleSelectEnvelope,
}: EnvelopeListProps) {
  const envelopes = useEnvelopes();

  if (!envelopes || !envelopes.length)
    return <p className="text-gray-500 text-center mt-4">No envelopes yet</p>;

  return (
    <div className="overflow-y-auto flex flex-col">
      {envelopes.map((envelope) => {
        const spent = envelope.spent;
        const percentUsed =
          envelope.budget > 0 ? Math.min(100, Math.round((spent / envelope.budget) * 100)) : 0;
        const isSelected = selectedEnvelopeId === envelope.id;

        return envelope.isActive ? (
          <Field
            key={envelope.id}
            className={`cursor-pointer py-4 px-6 gap-1 text-gray-600 transition ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-100'}`}
            onClick={() => handleSelectEnvelope(envelope.id)}
          >
            <FieldLabel htmlFor={`progress-${envelope.id}`} className="cursor-pointer">
              <span>{envelope.name}</span>
              <span className="ml-auto">
                {spent.toFixed(2)} / {envelope.budget.toFixed(2)} $
              </span>
            </FieldLabel>
            <Progress
              value={percentUsed}
              className={`h-1`}
              id={`progress-${envelope.id}`}
              key={`${envelope.id}`}
            />
          </Field>
        ) : (
          <InactiveEnvelopeItem key={envelope.id} envelope={envelope} />
        );
      })}
    </div>
  );
}
