import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Envelope } from '@/pages/Dashboard';
import { AddExpenseDialog } from './CreateExpenseForm';
import { DeleteEnvelopeButton } from './DeleteEnvelopeButton';
import { ExpenseList } from './ExpenseList';
import { Edit } from 'lucide-react';
import { EditEnvelopeButton } from './EditEnvelopeButton';

interface Props {
  selectedEnvelope: Envelope | null;
  setSelectedEnvelopeId: (envelopeId: number | null) => void;
}

export default function EnvelopeCard({ selectedEnvelope, setSelectedEnvelopeId }: Props) {
  if (!selectedEnvelope) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-center">Select an envelope to see details</p>
      </div>
    );
  }

  const totalAssigned = selectedEnvelope.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = selectedEnvelope.budget - totalAssigned;
  const percentUsed = (totalAssigned / selectedEnvelope.budget) * 100;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <Card className="p-6 w-full">
        <CardHeader className="p-0">
          <div className="flex justify-end">
            <EditEnvelopeButton
              envelopeId={selectedEnvelope.id}
              name={selectedEnvelope.name}
              budget={selectedEnvelope.budget}
            />
            <DeleteEnvelopeButton
              envelopeId={selectedEnvelope.id}
              setSelectedEnvelopeId={setSelectedEnvelopeId}
            />
          </div>
          <div className="flex justify-between items-center mb-4 mt-2">
            <CardTitle className="text-xl font-semibold">{selectedEnvelope.name}</CardTitle>
            <span className="text-orange-500 font-bold text-lg">${remainingBudget.toFixed(2)}</span>
          </div>
        </CardHeader>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {percentUsed.toFixed(1)}% of ${selectedEnvelope.budget.toFixed(2)} budget used
          </p>
        </div>

        {/* Budget summary */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex flex-col">
            <span className="text-gray-500">Assigned So Far</span>
            <span className="font-semibold">${totalAssigned.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">To Go</span>
            <span className="font-semibold">${remainingBudget.toFixed(2)}</span>
          </div>
        </div>

        {/* Expenses actions */}
        <div className="flex flex-col gap-2 mt-2 border-t border-gray-200 pt-4">
          <AddExpenseDialog envelopeId={selectedEnvelope.id} />

          <ExpenseList expenses={selectedEnvelope.expenses} envelopeId={selectedEnvelope.id} />
        </div>
      </Card>
    </div>
  );
}
