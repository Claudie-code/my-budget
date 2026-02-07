import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomesApi } from '@/features/incomes/incomes.api';

export function useIncomes() {
  const queryClient = useQueryClient();

  const incomesQuery = useQuery({
    queryKey: ['incomes'],
    queryFn: incomesApi.getAll,
  });

  const createIncome = useMutation({
    mutationFn: incomesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });

  const deleteIncome = useMutation({
    mutationFn: incomesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });

  return {
    incomesQuery,
    createIncome,
    deleteIncome,
  };
}
