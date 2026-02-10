import { Wallet } from 'lucide-react';
import { IncomeDrawer } from './IncomeDrawer';
import type { Income } from '@/types/dashboard';

interface IncomeSummaryProps {
  incomes: Income[];
  unallocatedCash: number;
}

export const IncomeSummary = ({ incomes, unallocatedCash }: IncomeSummaryProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-6 bg-background rounded-xl border shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-3xl font-semibold">{unallocatedCash.toLocaleString()} $</div>
          <div className="text-sm text-muted-foreground">Cash Available</div>
        </div>
      </div>

      <IncomeDrawer incomes={incomes} />
    </div>
  );
};
