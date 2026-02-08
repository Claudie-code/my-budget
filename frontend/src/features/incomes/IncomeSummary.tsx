import { Wallet, Pencil } from 'lucide-react';
import { IncomeDrawer } from './IncomeDrawer';

export const IncomeSummary = ({ total }: { total: number }) => {
  return (
    <div className="mx-auto mt-6 w-full max-w-xl rounded-xl border bg-background p-6 shadow-sm">
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

        <IncomeDrawer
          trigger={
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          }
        />
      </div>
    </div>
  );
};
