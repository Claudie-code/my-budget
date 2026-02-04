import { useQuery } from '@tanstack/react-query';
import EnvelopeCard from '@/components/dashboard/EnvelopeCard';
import CreateEnvelopeForm from '@/components/dashboard/CreateEnvelopeForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnvelopeList from '@/components/dashboard/EnvelopeList';
import { useState } from 'react';

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
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null);

  const {
    data: envelopes,
    isLoading,
    isError,
  } = useQuery<Envelope[]>({
    queryKey: ['envelopes'],
    queryFn: fetchEnvelopes,
  });

  const selectedEnvelope = envelopes?.find((e) => e.id === selectedEnvelopeId) || null;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading envelopes</p>;

  return (
    <DashboardLayout>
      <div className="flex h-full gap-4">
        <div className="w-1/3 border-r overflow-y-auto py-4 px-6">
          <CreateEnvelopeForm />
          <EnvelopeList
            envelopes={envelopes || []}
            selectedEnvelopeId={selectedEnvelope?.id}
            setSelectedEnvelopeId={setSelectedEnvelopeId}
          />
        </div>
        <EnvelopeCard
          selectedEnvelope={selectedEnvelope}
          setSelectedEnvelopeId={setSelectedEnvelopeId}
        />
      </div>
    </DashboardLayout>
  );
}
