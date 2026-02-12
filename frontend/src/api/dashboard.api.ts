import { api } from '@/lib/api';

export const fetchDashboard = async (month?: string) => {
  const { data } = await api.get(`/api/dashboard${month ? `?month=${month}` : ''}`);
  return data;
};
