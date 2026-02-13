import { Badge } from '@/components/ui/badge';
import { CoverForm } from './CoverForm';

export function RemainingRow({
  remaining,
  isOverspent,
}: {
  remaining: number;
  isOverspent: boolean;
}) {
  return (
    <div className="flex items-center justify-between font-semibold">
      <div className="flex items-center gap-2">
        <span>Remaining</span>
      </div>

      <div className="flex items-center gap-3">
        {isOverspent && <CoverForm defaultAmount={Math.abs(remaining).toFixed(2)} />}
        <span
          className={`tabular-nums text-base ${isOverspent ? 'text-destructive' : 'text-emerald-600'}`}
        >
          {remaining.toFixed(2)} $
        </span>
      </div>
    </div>
  );
}
