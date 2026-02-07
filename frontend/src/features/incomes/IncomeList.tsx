import { IncomeCard } from './IncomeCard';
import { useIncomes } from './use-incomes';

export function IncomeList() {
  const { incomesQuery, deleteIncome } = useIncomes();

  if (incomesQuery.isLoading) return <p>Loading incomes…</p>;
  if (incomesQuery.isError) return <p>Error loading incomes</p>;

  return (
    <div className="space-y-2">
      {incomesQuery.data.map((income: any) => (
        <IncomeCard
          key={income.id}
          income={income}
          onDelete={() => deleteIncome.mutate(income.id)}
        />
      ))}
    </div>
  );
}
