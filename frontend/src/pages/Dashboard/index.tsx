import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboard } from '@/hooks/use-dashboard';
import { useMediaQuery } from '@/hooks/use-media-query';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { EnvelopeSection } from '@/components/envelopes/EnvelopeSection';
import { EnvelopeDetail } from '@/components/envelopes/EnvelopeDetail';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  const { data, isLoading, isError } = useDashboard(month);

  const totalIncome = useMemo(
    () => data?.incomes.reduce((sum, i) => sum + i.amount, 0) ?? 0,
    [data?.incomes],
  );

  const totalBudget = useMemo(
    () => data?.envelopes.reduce((sum, e) => sum + e.budget, 0) ?? 0,
    [data?.envelopes],
  );

  const onCloseEnvelope = () => setSelectedEnvelopeId(null);
  const handleSelectEnvelope = (id: number) => setSelectedEnvelopeId(id);
  const handleChangeMonth = (newMonth: string) => {
    setMonth(newMonth);
    setSelectedEnvelopeId(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  if (!isError || !data) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="m-6 max-w-xl">
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription>
            Please try refreshing the page or check your connection.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  const envelopes = data.envelopes ?? [];
  const incomes = data.incomes ?? [];
  const selectedEnvelope = envelopes.find((e) => e.id === selectedEnvelopeId) || null;

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row items-center w-full py-4 px-6 border-b">
        <DashboardTopBar
          month={month}
          onChangeMonth={handleChangeMonth}
          totalIncome={totalIncome}
          totalBudget={totalBudget}
          incomes={incomes}
        />
      </section>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <EnvelopeSection
          envelopes={envelopes}
          selectedEnvelopeId={selectedEnvelope?.id}
          handleSelectEnvelope={handleSelectEnvelope}
        />
        <EnvelopeDetail
          selectedEnvelope={selectedEnvelope}
          onCloseEnvelope={onCloseEnvelope}
          isMobile={isMobile}
        />
      </div>
    </DashboardLayout>
  );
}
