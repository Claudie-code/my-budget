import { useQuery } from '@tanstack/react-query';
import EnvelopeCard from './EnvelopeCard';
import type { Envelope } from '@/pages/Dashboard';

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

export default function EnvelopeList() {
  const { data, isLoading, isError } = useQuery<Envelope[]>({
    queryKey: ['envelopes'],
    queryFn: fetchEnvelopes,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading envelopes</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((env) => (
        <EnvelopeCard key={env.id} envelope={env} />
      ))}
    </div>
  );
}
