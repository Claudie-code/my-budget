import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Envelope } from '@/pages/Dashboard';

interface Props {
  envelope: Envelope;
}

export default function EnvelopeCard({ envelope }: Props) {
  const queryClient = useQueryClient();
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);

  const totalExpenses = envelope.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = envelope.budget - totalExpenses;

  const addExpenseMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          description: expenseDesc,
          amount: expenseAmount,
          envelopeId: envelope.id,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add expense');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      toast.success('Expense added!');
      setExpenseDesc('');
      setExpenseAmount(0);
    },
    onError: () => toast.error('Failed to add expense'),
  });

  const deleteEnvelopeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/envelopes/${envelope.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete envelope');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      toast.success('Envelope deleted!');
    },
    onError: () => toast.error('Failed to delete envelope'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{envelope.name}</CardTitle>
        <p>Budget remaining: ${remainingBudget}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {envelope.expenses.map((exp) => (
          <div key={exp.id} className="flex justify-between border-b pb-1 text-sm">
            <span>{exp.description}</span>
            <span>${exp.amount}</span>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Description"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                />
                <Button onClick={() => addExpenseMutation.mutate()}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" variant="destructive" onClick={() => deleteEnvelopeMutation.mutate()}>
            Delete Envelope
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
