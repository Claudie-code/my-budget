import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    enabled: !!token,
  });
};
