import { useCurrentUser } from '@/hooks/use-current-user';
import { Navigate } from 'react-router';

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <Navigate to="/" replace />;

  return children;
}
