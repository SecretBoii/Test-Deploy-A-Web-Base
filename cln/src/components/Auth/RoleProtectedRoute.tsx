import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleProtectedRouteProps {
  allowedRoles: number[];
}

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>กำลังยืนยัน......</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.roleId)) {
    // If student tries to access teacher/admin pages, redirect to /home
    // If teacher/admin tries to access student pages, redirect to /dashboard
    return user.roleId === 1 
      ? <Navigate to="/home" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleProtectedRoute;
