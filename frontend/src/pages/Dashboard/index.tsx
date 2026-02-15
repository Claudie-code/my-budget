import { useState } from 'react';
import dayjs from 'dayjs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboard } from '@/hooks/use-dashboard';
import { useMediaQuery } from '@/hooks/use-media-query';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { EnvelopeSection } from '@/components/envelopes/EnvelopeSection';
import { EnvelopeDetail } from '@/components/envelopes/EnvelopeDetail';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EnvelopesProvider } from '@/providers/EnvelopesProvider';

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  const { data, isLoading, isError } = useDashboard(month);

  const onCloseEnvelope = () => setSelectedEnvelopeId(null);
  const handleSelectEnvelope = (id: number) => setSelectedEnvelopeId(id);
  const handleChangeMonth = (newMonth: string) => {
    setMonth(newMonth);
    setSelectedEnvelopeId(null);
  };

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data)
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

  const envelopes = data.envelopes;
  const selectedEnvelope = envelopes.find((e) => e.id === selectedEnvelopeId) || null;

  return (
    <DashboardLayout>
      <EnvelopesProvider envelopes={envelopes}>
        <section className="flex flex-col lg:flex-row items-center w-full py-4 px-6 border-b">
          <DashboardTopBar
            month={month}
            onChangeMonth={handleChangeMonth}
            totalIncome={data.totalIncome}
            readyToAssign={data.readyToAssign}
            incomes={data.incomes}
          />
        </section>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <EnvelopeSection
            totalBudgeted={data.totalBudgeted}
            selectedEnvelopeId={selectedEnvelope?.id}
            handleSelectEnvelope={handleSelectEnvelope}
          />
          <EnvelopeDetail
            selectedEnvelope={selectedEnvelope}
            onCloseEnvelope={onCloseEnvelope}
            isMobile={isMobile}
          />
        </div>
      </EnvelopesProvider>
    </DashboardLayout>
  );
}
