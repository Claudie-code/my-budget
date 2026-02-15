import { api } from '@/lib/api';
import type { Transaction } from '@/types/dashboard';

export interface CreateTransactionPayload {
  description: string;
  amount: number; // positif = revenu, négatif = dépense
  date: string;
  envelopeId?: number; // optionnel
}

export interface UpdateTransactionPayload {
  id: number;
  description: string;
  amount: number;
  date?: string;
  envelopeId?: number;
}

/**
 * CREATE
 */
export const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const { data } = await api.post('/api/transactions', payload);
  return data;
};

/**
 * UPDATE
 */
export const updateTransaction = async (
  payload: UpdateTransactionPayload,
): Promise<Transaction> => {
  const { id, ...body } = payload;
  const { data } = await api.put(`/api/transactions/${id}`, body);
  return data;
};

/**
 * DELETE
 */
export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/api/transactions/${id}`);
};
