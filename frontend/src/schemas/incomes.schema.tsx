import z from 'zod';

export const incomeSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
});
