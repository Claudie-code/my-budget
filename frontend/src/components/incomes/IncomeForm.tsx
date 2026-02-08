import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIncomes } from '../../hooks/use-incomes';

export function IncomeForm() {
  const { createIncome } = useIncomes();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    createIncome.mutate({
      description,
      amount: Number(amount),
    });
    setDescription('');
    setAmount('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button type="submit">Add</Button>
    </form>
  );
}
