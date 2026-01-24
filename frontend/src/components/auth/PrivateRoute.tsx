import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Navigate } from 'react-router';

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <Navigate to="/" replace />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
