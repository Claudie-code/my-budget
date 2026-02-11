import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '../layout/DashboardLayout';

export const DashboardSkeleton = () => (
  <DashboardLayout>
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-10 w-32 mb-4" />
      <div className="flex gap-4 min-h-100">
        <div className="flex-1 flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="flex-1 hidden lg:block">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  </DashboardLayout>
);
