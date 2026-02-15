import type { Transaction } from '@/types/dashboard';
import { IncomeCard } from './IncomeCard';
import { useDeleteTransaction } from '@/hooks/use-transactions';

export function IncomeList({ incomes }: { incomes: Transaction[] }) {
  const { mutate } = useDeleteTransaction();

  if (incomes.length === 0) return <p>No incomes to display</p>;

  return (
    <div className="space-y-2">
      {incomes.map((income: any) => (
        <IncomeCard key={income.id} income={income} onDelete={() => mutate(income.id)} />
      ))}
    </div>
  );
}
