import { useQuery } from '@tanstack/react-query';
import EnvelopeCard from '@/components/dashboard/EnvelopeCard';
import CreateEnvelopeForm from '@/components/dashboard/CreateEnvelopeForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnvelopeList from '@/components/dashboard/EnvelopeList';

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

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <CreateEnvelopeForm />
        <EnvelopeList />
      </div>
    </DashboardLayout>
  );
}
