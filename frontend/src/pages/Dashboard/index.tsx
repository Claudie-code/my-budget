import { useQuery } from '@tanstack/react-query';
import EnvelopeCard from '@/components/dashboard/EnvelopeCard';
import CreateEnvelopeForm from '@/components/dashboard/CreateEnvelopeForm';

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
  const {
    data: envelopes,
    isLoading,
    isError,
  } = useQuery<Envelope[]>({
    queryKey: ['envelopes'],
    queryFn: fetchEnvelopes,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading envelopes</p>;

  return (
    <div className="p-4">
      <CreateEnvelopeForm />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {envelopes?.map((env) => (
          <EnvelopeCard key={env.id} envelope={env} />
        ))}
      </div>
    </div>
  );
}
