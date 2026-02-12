import { IncomeCard } from './IncomeCard';
import type { Income } from '@/types/dashboard';
import { useDeleteIncome } from '@/hooks/use-incomes';

export function IncomeList({ incomes }: { incomes: Income[] }) {
  const { mutate } = useDeleteIncome();

  if (incomes.length === 0) return <p>No incomes to display</p>;

  return (
    <div className="space-y-2">
      {incomes.map((income: any) => (
        <IncomeCard key={income.id} income={income} onDelete={() => mutate(income.id)} />
      ))}
    </div>
  );
}
