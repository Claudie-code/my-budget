import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { AddExpenseDialog } from '../expenses/CreateExpenseForm';
import { DeleteEnvelopeButton } from './DeleteEnvelopeButton';
import { ExpenseList } from '../expenses/ExpenseList';
import { EditEnvelopeButton } from './EditEnvelopeButton';
import type { Envelope } from '@/types/dashboard';
import { Progress } from '@/components/ui/progress';
import { EnvelopeSummary } from './EnvelopeSummary';

interface Props {
  selectedEnvelope: Envelope | null;
  onCloseEnvelope: () => void;
}

export default function EnvelopeCard({ selectedEnvelope, onCloseEnvelope }: Props) {
  if (!selectedEnvelope) {
    return <p className="text-gray-500 text-center pt-6">Select an envelope to see details</p>;
  }

  const totalSpent = selectedEnvelope.spent;
  const remaining = selectedEnvelope.available;
  const percentUsed =
    selectedEnvelope.budget > 0 ? (totalSpent / selectedEnvelope.budget) * 100 : 0;
  console.log('transaction', selectedEnvelope.transactions);
  return (
    <Card className="p-6 w-full shadow-none border-0">
      <CardHeader className="p-0 mb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{selectedEnvelope.name}</CardTitle>
          <div className="flex gap-2">
            <EditEnvelopeButton
              envelopeId={selectedEnvelope.id}
              name={selectedEnvelope.name}
              budget={selectedEnvelope.budget}
            />
            <DeleteEnvelopeButton
              envelopeId={selectedEnvelope.id}
              onCloseEnvelope={onCloseEnvelope}
            />
          </div>
        </div>
      </CardHeader>

      {/* Progress bar */}
      <div className="mb-4">
        <Progress value={percentUsed} className={`h-2 rounded-full`} />
        <p className="text-sm text-gray-600 mt-1">
          {remaining < 0
            ? `You have exceeded your budget by ${Math.abs(remaining).toFixed(2)} $`
            : `${remaining.toFixed(2)} $ remaining`}
        </p>
      </div>

      <EnvelopeSummary
        selectedEnvelope={selectedEnvelope}
        totalSpent={totalSpent}
        remaining={remaining}
      />

      {/* Expenses */}
      <div className="flex flex-col gap-2 mt-4 border-t border-gray-200 pt-4">
        <AddExpenseDialog envelopeId={selectedEnvelope.id} />
        <ExpenseList expenses={selectedEnvelope.transactions} envelopeId={selectedEnvelope.id} />
      </div>
    </Card>
  );
}
