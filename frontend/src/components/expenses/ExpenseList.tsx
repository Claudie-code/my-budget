import type { Transaction } from '@/types/dashboard';
import { ExpenseItem } from './ExpenseItem';

interface Props {
  expenses: Transaction[];
  envelopeId: number;
}

export function ExpenseList({ expenses }: Props) {
  console.log('expenses', expenses);
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
