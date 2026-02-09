import { IncomeCard } from './IncomeCard';
import { useIncomes } from '../../hooks/use-incomes';
import type { Income } from '@/types/dashboard';

export function IncomeList({ incomes }: { incomes: Income[] }) {
  const { deleteIncome } = useIncomes();

  if (incomes.length === 0) return <p>No incomes to display</p>;

  return (
    <div className="space-y-2">
      {incomes.map((income: any) => (
        <IncomeCard
          key={income.id}
          income={income}
          onDelete={() => deleteIncome.mutate(income.id)}
        />
      ))}
    </div>
  );
}
