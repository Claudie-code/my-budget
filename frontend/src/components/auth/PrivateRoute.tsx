import { useCurrentUser } from '@/hooks/use-current-user';
import { Navigate } from 'react-router';
import { Spinner } from '../ui/spinner';

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Spinner className="size-8" />
      </div>
    );
  if (isError || !user) return <Navigate to="/" replace />;

  return children;
}
