import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { AddExpenseDialog } from '../expenses/CreateExpenseForm';
import { DeleteEnvelopeButton } from './DeleteEnvelopeButton';
import { ExpenseList } from '../expenses/ExpenseList';
import { EditEnvelopeButton } from './EditEnvelopeButton';
import type { Envelope } from '@/types/dashboard';

interface Props {
  selectedEnvelope: Envelope | null;
  onCloseEnvelope: () => void;
}

export default function EnvelopeCard({ selectedEnvelope, onCloseEnvelope }: Props) {
  if (!selectedEnvelope) {
    return <p className="text-gray-500 text-center pt-6">Select an envelope to see details</p>;
  }

  const totalSpent = selectedEnvelope.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = selectedEnvelope.budget - totalSpent;
  const percentUsed = (totalSpent / selectedEnvelope.budget) * 100;

  return (
    <Card className="p-6 w-full">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center mb-4 mt-2">
          <CardTitle className="text-xl font-semibold">{selectedEnvelope.name}</CardTitle>
          <div className="">
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

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {remainingBudget < 0
            ? `You have exceeded your budget by $${Math.abs(remainingBudget).toFixed(2)}`
            : `You have $${remainingBudget.toFixed(2)} remaining of your budget`}
        </p>
      </div>

      {/* Budget summary */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Budget</span>
          <span className="font-medium">${selectedEnvelope.budget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total spent</span>
          <span>${totalSpent.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm font-semibold">
          <span>Remaining</span>
          <span className={remainingBudget < 0 ? 'text-red-500' : 'text-green-600'}>
            ${remainingBudget.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Expenses actions */}
      <div className="flex flex-col gap-2 mt-2 border-t border-gray-200 pt-4">
        <AddExpenseDialog envelopeId={selectedEnvelope.id} />

        <ExpenseList expenses={selectedEnvelope.expenses} envelopeId={selectedEnvelope.id} />
      </div>
    </Card>
  );
}
