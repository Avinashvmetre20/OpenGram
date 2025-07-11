import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import AccessDenied from '../common/AccessDenied';
import './ProtectedRoute.css';

const ProtectedRoute = ({
  children,
  adminOnly = false,
  roles = [],
  redirectPath = '/login',
  showDenied = true
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner />
        <p>Checking access permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL for redirect after login
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectPath}?redirect=${redirectTo}`} replace />;
  }

  // Check if specific roles are required
  const hasRequiredRole = roles.length === 0 ||
    (user?.role && roles.includes(user.role));

  // Check admin access if required
  const isAdminAccessValid = !adminOnly || user?.role === 'admin';

  if (!hasRequiredRole || !isAdminAccessValid) {
    return showDenied ? (
      <AccessDenied
        requiredRoles={adminOnly ? ['admin'] : roles}
        currentRole={user?.role}
      />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return children;
};

export default ProtectedRoute;