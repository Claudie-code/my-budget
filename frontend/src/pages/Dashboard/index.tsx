import { useQuery } from '@tanstack/react-query';
import EnvelopeCard from '@/features/envelopes/EnvelopeCard';
import CreateEnvelopeForm from '@/features/envelopes/CreateEnvelopeForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnvelopeList from '@/features/envelopes/EnvelopeList';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useMediaQuery } from '@/hooks/use-media-query';
import EnvelopeDrawer from '@/features/envelopes/EnvelopeDrawer';
import { IncomeSummary } from '@/features/incomes/IncomeSummary';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  envelopeId: number;
}

export interface Envelope {
  id: number;
  name: string;
  budget: number;
  expenses: Expense[];
}

const fetchEnvelopes = async (): Promise<Envelope[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/envelopes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch envelopes');
  }
  return res.json();
};

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null);

  const {
    data: envelopes,
    isLoading,
    isError,
  } = useQuery<Envelope[]>({
    queryKey: ['envelopes'],
    queryFn: fetchEnvelopes,
  });

  const onCloseEnvelope = () => setSelectedEnvelopeId(null);

  const handleSelectEnvelope = (id: number) => {
    setSelectedEnvelopeId(id);
  };

  const selectedEnvelope = envelopes?.find((e) => e.id === selectedEnvelopeId) || null;

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-sm text-red-500 py-4 px-6">Failed to load envelopes</div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 py-4 px-6">
          <Spinner className="size-6" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex items-center w-full py-4 px-6 border-b">
        <div>Feb 2026</div>
        <IncomeSummary total={1500} />
      </section>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <section className={`${isMobile ? 'w-full' : 'w-1/3'} border-r overflow-y-auto py-4 px-6`}>
          <CreateEnvelopeForm />
          <EnvelopeList
            envelopes={envelopes || []}
            selectedEnvelopeId={selectedEnvelope?.id}
            handleSelectEnvelope={handleSelectEnvelope}
          />
        </section>
        <section className="flex-1 overflow-y-auto py-4 px-6">
          {!isMobile && (
            <EnvelopeCard selectedEnvelope={selectedEnvelope} onCloseEnvelope={onCloseEnvelope} />
          )}
          {isMobile && selectedEnvelope && (
            <EnvelopeDrawer envelope={selectedEnvelope} onClose={onCloseEnvelope} />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
