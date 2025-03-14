import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  redirectPath?: string;
};

export const ProtectedRoute = ({
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
