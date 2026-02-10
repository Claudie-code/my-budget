import { Wallet } from 'lucide-react';
import { IncomeDrawer } from '@/components/incomes/IncomeDrawer';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import type { Income } from '@/types/dashboard';

interface TopBarProps {
  month: string;
  onChangeMonth: (newMonth: string) => void;
  totalIncome: number;
  totalBudget: number;
  incomes: Income[];
}

export const DashboardTopBar = ({
  month,
  onChangeMonth,
  totalIncome,
  totalBudget,
  incomes,
}: TopBarProps) => {
  const unallocatedCash = totalIncome - totalBudget;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full py-4">
      {/* Left: Month Selector */}
      <div className="shrink-0">
        <MonthSelector month={month} onChange={onChangeMonth} />
      </div>

      {/* Center: Cash Available */}
      <div className="flex-1 flex flex-col items-center text-sm text-gray-500">
        <span className="font-medium text-2xl">{unallocatedCash.toFixed(2)} $</span>
        <span className="">Cash Available</span>
      </div>

      {/* Right: Income */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-lg font-semibold">{totalIncome.toFixed(2)} $</div>
            <div className="text-xs text-muted-foreground">Total Income</div>
          </div>
        </div>

        <IncomeDrawer incomes={incomes} />
      </div>
    </div>
  );
};
