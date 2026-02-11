import CreateEnvelopeForm from '@/components/envelopes/CreateEnvelopeForm';
import EnvelopeList from '@/components/envelopes/EnvelopeList';
import type { Envelope } from '@/types/dashboard';

interface EnvelopeSectionProps {
  envelopes: Envelope[];
  selectedEnvelopeId?: number;
  handleSelectEnvelope: (id: number) => void;
}

const TotalBudget = ({ total }: { total: number }) => (
  <div className="text-sm font-medium ">Total: {total.toFixed(2)} $</div>
);

export const EnvelopeSection = ({
  envelopes,
  selectedEnvelopeId,
  handleSelectEnvelope,
}: EnvelopeSectionProps) => {
  const totalBudget = envelopes.reduce((sum, e) => sum + e.budget, 0);

  return (
    <section className="flex-1 overflow-y-auto border-r max-w-2/4">
      <div className="flex items-center justify-between py-4 px-6">
        <CreateEnvelopeForm />
        <TotalBudget total={totalBudget} />
      </div>
      <EnvelopeList
        envelopes={envelopes}
        selectedEnvelopeId={selectedEnvelopeId}
        handleSelectEnvelope={handleSelectEnvelope}
      />
    </section>
  );
};
