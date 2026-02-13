import { api } from '@/lib/api';
import type { Envelope } from '@/types/dashboard';

export interface CreateEnvelopePayload {
  name: string;
  budget: number;
}

export interface UpdateEnvelopePayload {
  id: number;
  name: string;
  budget: number;
}

interface TransferPayload {
  fromId: number;
  toId: number;
  amount: number;
}

/**
 * CREATE
 */
export const createEnvelope = async (payload: CreateEnvelopePayload): Promise<Envelope> => {
  const { data } = await api.post('/api/envelopes', payload);
  return data;
};

/**
 * UPDATE
 */
export const updateEnvelope = async (payload: UpdateEnvelopePayload): Promise<Envelope> => {
  const { id, ...body } = payload;
  const { data } = await api.put(`/api/envelopes/${id}`, body);
  return data;
};

/**
 * DELETE (soft delete)
 */
export const deleteEnvelope = async (id: number): Promise<{ action?: string }> => {
  const response = await api.delete(`/api/envelopes/${id}`);
  return { action: response.data?.action };
};

/**
 * ACTIVATE (reactivate)
 */
export const activateEnvelope = async (id: number): Promise<void> => {
  await api.patch(`/api/envelopes/${id}/activate`);
};

export const transferEnvelope = async (payload: TransferPayload): Promise<void> => {
  await api.post('/api/envelopes/transfer', payload);
};
