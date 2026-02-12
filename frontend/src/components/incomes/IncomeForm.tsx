import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { useCreateIncome } from '@/hooks/use-incomes';
import { z } from 'zod';

interface IncomeFormState {
  description: string;
  amount: string;
}

const incomeSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
});

export function IncomeForm() {
  const [form, setForm] = useState<IncomeFormState>({ description: '', amount: '' });
  const [errors, setErrors] = useState<Partial<IncomeFormState>>({});

  const { mutate, isPending } = useCreateIncome();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = incomeSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Partial<IncomeFormState> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as keyof IncomeFormState] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutate(
      { description: parsed.data.description, amount: Number(parsed.data.amount) },
      {
        onSuccess: () => {
          setForm({ description: '', amount: '' });
        },
      },
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Input
          id="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Salary, freelance, etc."
        />
        {errors.description && <FieldError>{errors.description}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="amount">Amount</FieldLabel>
        <Input
          id="amount"
          type="number"
          min={0}
          step={0.01}
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
        />
        {errors.amount && <FieldError>{errors.amount}</FieldError>}
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add'}
      </Button>
    </form>
  );
}
