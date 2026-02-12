import { api } from '@/lib/api';
import type { Income } from '@/types/dashboard';

export interface CreateIncomePayload {
  description: string;
  amount: number;
}

export interface UpdateIncomePayload {
  id: number;
  description: string;
  amount: number;
}

/**
 * CREATE
 */
export const createIncome = async (payload: CreateIncomePayload): Promise<Income> => {
  const { data } = await api.post('/api/incomes', payload);
  return data;
};

/**
 * UPDATE
 */
export const updateIncome = async (payload: UpdateIncomePayload): Promise<Income> => {
  const { id, ...body } = payload;
  const { data } = await api.put(`/api/incomes/${id}`, body);
  return data;
};

/**
 * DELETE
 */
export const deleteIncome = async (id: number): Promise<void> => {
  await api.delete(`/api/incomes/${id}`);
};
