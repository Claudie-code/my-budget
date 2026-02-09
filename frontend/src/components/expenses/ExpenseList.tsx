import { ExpenseItem } from './ExpenseItem';
import type { Expense } from '@/types/dashboard';

interface Props {
  expenses: Expense[];
  envelopeId: number;
}

export function ExpenseList({ expenses }: Props) {
  if (expenses.length === 0) {
    return <div className="text-sm text-muted-foreground">No expenses yet. Add your first one</div>;
  }

  return (
    <ul className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </ul>
  );
}
