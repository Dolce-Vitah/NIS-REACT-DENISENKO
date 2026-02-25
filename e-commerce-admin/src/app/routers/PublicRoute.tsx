import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';


export const PublicRoute = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

