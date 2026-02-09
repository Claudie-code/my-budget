import { Wallet } from 'lucide-react';
import { IncomeDrawer } from './IncomeDrawer';
import type { Income } from '@/types/dashboard';

export const IncomeSummary = ({ total, incomes }: { total: number; incomes: Income[] }) => {
  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>

          <div>
            <div className="text-3xl font-semibold">{total.toLocaleString()} €</div>
            <div className="text-sm text-muted-foreground">Total income</div>
          </div>
        </div>

        <IncomeDrawer incomes={incomes} />
      </div>
    </div>
  );
};
