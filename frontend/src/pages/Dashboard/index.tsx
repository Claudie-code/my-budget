import EnvelopeCard from '@/components/envelopes/EnvelopeCard';
import CreateEnvelopeForm from '@/components/envelopes/CreateEnvelopeForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnvelopeList from '@/components/envelopes/EnvelopeList';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useMediaQuery } from '@/hooks/use-media-query';
import EnvelopeDrawer from '@/components/envelopes/EnvelopeDrawer';
import { IncomeSummary } from '@/components/incomes/IncomeSummary';
import { useDashboard } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';
import { MonthSelector } from '@/components/dashboard/MonthSelector';

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  const { data, isLoading, isError } = useDashboard(month);

  const onCloseEnvelope = () => setSelectedEnvelopeId(null);

  const handleSelectEnvelope = (id: number) => {
    setSelectedEnvelopeId(id);
  };

  const handleChangeMonth = (newMonth: string) => {
    setMonth(newMonth);
    setSelectedEnvelopeId(null);
  };

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-sm text-red-500 py-4 px-6">Failed to load envelopes</div>
      </DashboardLayout>
    );
  }

  if (!data) return <Skeleton />;

  const selectedEnvelope = data.envelopes?.find((e) => e.id === selectedEnvelopeId) || null;

  const totalIncome = data.incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <DashboardLayout>
      <section className="flex items-center w-full py-4 px-6 border-b">
        {isLoading ? (
          <Skeleton className="h-10 w-32 mb-0" />
        ) : (
          <>
            <MonthSelector month={month} onChange={handleChangeMonth} />
            <IncomeSummary total={totalIncome} />{' '}
          </>
        )}
      </section>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <section className={`${isMobile ? 'w-full' : 'w-1/3'} border-r overflow-y-auto py-4 px-6`}>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <CreateEnvelopeForm />
              <EnvelopeList
                envelopes={data.envelopes || []}
                selectedEnvelopeId={selectedEnvelope?.id}
                handleSelectEnvelope={handleSelectEnvelope}
              />
            </>
          )}
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
