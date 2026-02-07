import { Button } from '@/components/ui/button';

export function IncomeCard({
  income,
  onDelete,
}: {
  income: { id: number; description: string; amount: number };
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between items-center border rounded p-3">
      <span>
        {income.description} – {income.amount} $
      </span>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
