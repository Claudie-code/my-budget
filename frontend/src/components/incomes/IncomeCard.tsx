import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

export function IncomeCard({
  income,
  onDelete,
}: {
  income: { id: number; description: string; amount: number };
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3 transition-all hover:bg-muted/50">
      {/* Left content */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{income.description}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold tabular-nums">{income.amount.toFixed(2)} $</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-orange-500 hover:text-orange-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
