import CreateEnvelopeForm from '@/components/envelopes/CreateEnvelopeForm';
import EnvelopeList from '@/components/envelopes/EnvelopeList';

interface EnvelopeSectionProps {
  selectedEnvelopeId?: number;
  handleSelectEnvelope: (id: number) => void;
  totalBudgeted: number;
}

const TotalBudget = ({ total }: { total: number }) => (
  <div className="text-sm font-medium ">Total: {total.toFixed(2)} $</div>
);

export const EnvelopeSection = ({
  selectedEnvelopeId,
  totalBudgeted,
  handleSelectEnvelope,
}: EnvelopeSectionProps) => {
  return (
    <section className="flex-1 overflow-y-auto border-r max-w-2/4">
      <div className="flex items-center justify-between py-4 px-6">
        <CreateEnvelopeForm />
        <TotalBudget total={totalBudgeted} />
      </div>
      <EnvelopeList
        selectedEnvelopeId={selectedEnvelopeId}
        handleSelectEnvelope={handleSelectEnvelope}
      />
    </section>
  );
};
