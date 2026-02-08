import { authHeaders } from './incomes.api';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDashboard = async (month?: string) => {
  const res = await fetch(`${API_URL}/api/dashboard${month ? `?month=${month}` : ''}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
};
