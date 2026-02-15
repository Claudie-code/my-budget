import z from 'zod';

export const transitionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date must be a valid date'),
});
