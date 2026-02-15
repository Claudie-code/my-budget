import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2 } from 'lucide-react';
import type { Transaction } from '@/types/dashboard';
import { useDeleteTransaction, useEditTransaction } from '@/hooks/use-transactions';

interface Props {
  expense: Transaction;
}

export const ExpenseItem = ({ expense }: Props) => {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);

  const editMutation = useEditTransaction();
  const deleteMutation = useDeleteTransaction();

  if (editing) {
    return (
      <li className="flex gap-2 items-center flex-1">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-24"
        />
        <Button
          size="sm"
          onClick={() =>
            editMutation.mutate(
              { id: expense.id, description, amount },
              { onSuccess: () => setEditing(false) },
            )
          }
        >
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center text-sm text-gray-600">
      <span className="flex-1">{expense.description}</span>
      <span className="w-20 font-medium text-right">${expense.amount.toFixed(2)}</span>
      <div className="flex gap-1 ml-2">
        <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
          <Edit className="h-4 w-4 text-orange-500" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(expense.id)}>
          <Trash2 className="h-4 w-4 text-orange-500" />
        </Button>
      </div>
    </li>
  );
};
