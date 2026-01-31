import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Envelope } from '@/pages/Dashboard';
import { AddExpenseDialog } from './AddExpenseDialog';
import { DeleteEnvelopeButton } from './DeleteEnvelopeButton';

interface Props {
  envelope: Envelope;
}

export default function EnvelopeCard({ envelope }: Props) {
  const totalExpenses = envelope.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = envelope.budget - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{envelope.name}</CardTitle>
        <p className="text-sm text-muted-foreground">Remaining: ${remainingBudget}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {envelope.expenses.map((exp) => (
          <div key={exp.id} className="flex justify-between border-b pb-1 text-sm">
            <span>{exp.description}</span>
            <span>${exp.amount}</span>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <AddExpenseDialog envelopeId={envelope.id} />
          <DeleteEnvelopeButton envelopeId={envelope.id} />
        </div>
      </CardContent>
    </Card>
  );
}
