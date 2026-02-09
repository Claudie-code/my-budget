import { api } from '@/lib/api';
import type { Envelope } from '@/types/dashboard';

export interface CreateEnvelopePayload {
  name: string;
  budget: number;
}

export interface UpdateEnvelopePayload {
  id: number;
  name?: string;
  budget?: number;
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
export const deleteEnvelope = async (id: number): Promise<void> => {
  await api.delete(`/api/envelopes/${id}`);
};
