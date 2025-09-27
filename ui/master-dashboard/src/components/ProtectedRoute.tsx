import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
      department: string;
      tenantId?: string;
      tenant?: {
        id: string;
        name: string;
        subdomain: string;
      };
    };
    isAuthenticated: boolean;
  };
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(user.role)
    : user.role === requiredRole;

  if (!hasRequiredRole) {
    return <Navigate to="/login" replace />;
  }

  // Check tenant access for tenant routes
  if (user.role.startsWith('TENANT_')) {
    const currentPath = window.location.pathname;
    const tenantIdFromPath = currentPath.split('/')[2]; // /tenant/:tenantId/dashboard
    
    if (user.tenantId && user.tenantId !== tenantIdFromPath) {
      return <Navigate to={`/tenant/${user.tenantId}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
