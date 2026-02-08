import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/api/dashboard.api';
import type { DashboardData } from '@/types/dashboard';

export const useDashboard = (month: string) => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', month],
    queryFn: () => fetchDashboard(month),
  });
};
