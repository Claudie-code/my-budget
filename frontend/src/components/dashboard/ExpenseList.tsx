import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Edit, Trash, Trash2 } from 'lucide-react';
import type { Expense } from '@/pages/Dashboard';

interface Props {
  expenses: Expense[];
  envelopeId: number;
}

export function ExpenseList({ expenses, envelopeId }: Props) {
  const queryClient = useQueryClient();
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (expenseId: number) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete expense');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      toast.success('Expense deleted');
    },
    onError: () => toast.error('Failed to delete expense'),
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async (expense: { id: number; description: string; amount: number }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${expense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ description: expense.description, amount: expense.amount }),
      });
      if (!res.ok) throw new Error('Failed to edit expense');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      toast.success('Expense updated');
      setEditingExpenseId(null);
    },
    onError: () => toast.error('Failed to update expense'),
  });

  return (
    <div className="">
      <ul className="space-y-2">
        {expenses.length === 0 && (
          <div className="text-sm text-muted-foreground">No expenses yet. Add your first one</div>
        )}
        {expenses.map((exp) => (
          <li key={exp.id} className="flex justify-between items-center text-sm text-gray-600">
            {editingExpenseId === exp.id ? (
              <div className="flex gap-2 items-center flex-1">
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
                  onClick={() => editMutation.mutate({ id: exp.id, description, amount })}
                >
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingExpenseId(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1">{exp.description}</span>
                <span className="w-20 font-medium text-right">${exp.amount.toFixed(2)}</span>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingExpenseId(exp.id);
                      setDescription(exp.description);
                      setAmount(exp.amount);
                    }}
                  >
                    <Edit className="h-4 w-4 text-orange-500" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(exp.id)}>
                    <Trash2 className="h-4 w-4 text-orange-500" />
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
