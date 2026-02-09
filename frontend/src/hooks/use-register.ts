import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '@/api/auth.api';

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};
