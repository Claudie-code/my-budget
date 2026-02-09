import { api } from '@/lib/api';
import type { Expense } from '@/types/dashboard';

export interface CreateExpensePayload {
  description: string;
  amount: number;
  envelopeId: number;
}

export interface UpdateExpensePayload {
  id: number;
  description?: string;
  amount?: number;
}

/**
 * CREATE
 */
export const createExpense = async (payload: CreateExpensePayload): Promise<Expense> => {
  const { data } = await api.post('/api/expenses', payload);
  return data;
};

/**
 * UPDATE
 */
export const updateExpense = async (payload: UpdateExpensePayload): Promise<Expense> => {
  const { id, ...body } = payload;
  const { data } = await api.put(`/api/expenses/${id}`, body);
  return data;
};

/**
 * DELETE (soft delete)
 */
export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/api/expenses/${id}`);
};
