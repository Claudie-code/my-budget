import EnvelopeCard from '@/components/envelopes/EnvelopeCard';
import CreateEnvelopeForm from '@/components/envelopes/CreateEnvelopeForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnvelopeList from '@/components/envelopes/EnvelopeList';
import { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import EnvelopeDrawer from '@/components/envelopes/EnvelopeDrawer';
import { useDashboard } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';

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
  const totalBudget = data.envelopes.reduce((sum, e) => sum + e.budget, 0);

  const envelopes = data?.envelopes ?? [];
  const incomes = data?.incomes ?? [];

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row items-center w-full py-4 px-6 border-b">
        {isLoading ? (
          <Skeleton className="h-10 w-32 mb-0" />
        ) : (
          <DashboardTopBar
            month={month}
            onChangeMonth={handleChangeMonth}
            totalIncome={totalIncome}
            totalBudget={totalBudget}
            incomes={incomes}
          />
        )}
      </section>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <section className={`${isMobile ? 'w-full' : 'w-2/4 border-r'} overflow-y-auto`}>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between py-4 px-6">
                <CreateEnvelopeForm />
                <div className="text-sm font-medium ">Total: {totalBudget.toFixed(2)} $</div>
              </div>
              <EnvelopeList
                envelopes={envelopes}
                selectedEnvelopeId={selectedEnvelope?.id}
                handleSelectEnvelope={handleSelectEnvelope}
              />
            </>
          )}
        </section>
        {!isMobile && (
          <section className="flex-1 overflow-y-auto py-4 px-6 bg-gray-50">
            <EnvelopeCard selectedEnvelope={selectedEnvelope} onCloseEnvelope={onCloseEnvelope} />
          </section>
        )}
        {isMobile && selectedEnvelope && (
          <EnvelopeDrawer envelope={selectedEnvelope} onClose={onCloseEnvelope} />
        )}
      </div>
    </DashboardLayout>
  );
}
