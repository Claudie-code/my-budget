import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Envelope } from '@/pages/Dashboard';
import { AddExpenseDialog } from './AddExpenseDialog';
import { DeleteEnvelopeButton } from './DeleteEnvelopeButton';

interface Props {
  selectedEnvelope: Envelope | null;
  setSelectedEnvelope: (envelope: Envelope | null) => void;
}

export default function EnvelopeCard({ selectedEnvelope, setSelectedEnvelope }: Props) {
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
            <DeleteEnvelopeButton
              envelopeId={selectedEnvelope.id}
              setSelectedEnvelope={setSelectedEnvelope}
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
        <div className="flex gap-2 mt-2">
          <AddExpenseDialog envelopeId={selectedEnvelope.id} />
        </div>

        {/* Optional: show individual expenses */}
        {selectedEnvelope.expenses.length > 0 && (
          <div className="mt-2 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Expenses</h3>
            <ul className="space-y-2">
              {selectedEnvelope.expenses.map((exp) => (
                <li key={exp.id} className="flex justify-between text-sm text-gray-600">
                  <span>{exp.description}</span>
                  <span className="font-medium">${exp.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
