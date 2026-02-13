import z from 'zod';

export const coverFormSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  targetId: z.number().min(1, 'Select a target envelope'),
});
