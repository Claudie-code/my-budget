import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomesApi } from '@/api/incomes.api';

export function useIncomes() {
  const queryClient = useQueryClient();

  const incomesQuery = useQuery({
    queryKey: ['incomes'],
    queryFn: incomesApi.getAll,
  });

  const createIncome = useMutation({
    mutationFn: incomesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteIncome = useMutation({
    mutationFn: incomesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    incomesQuery,
    createIncome,
    deleteIncome,
  };
}
