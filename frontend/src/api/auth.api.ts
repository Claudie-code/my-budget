import { api } from '@/lib/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/**
 * LOGIN
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post('/api/auth/login', payload);
  return res.data;
};

/**
 * REGISTER
 */
export const register = async (payload: RegisterPayload): Promise<void> => {
  await api.post('/api/auth/register', payload);
};
