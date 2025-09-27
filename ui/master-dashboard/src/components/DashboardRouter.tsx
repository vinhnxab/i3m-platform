import React from 'react';
import { Navigate } from 'react-router-dom';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import TenantDashboard from '../pages/TenantDashboard';
import PlatformDashboard from '../pages/PlatformDashboard';

interface DashboardRouterProps {
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
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ user }) => {
  // Route based on user role
  switch (user.role) {
    case 'MARKETPLACE_DEVELOPER':
      return <DeveloperDashboard user={user} />;
    
    case 'TENANT_ADMIN':
    case 'TENANT_USER':
      if (!user.tenantId || !user.tenant) {
        return <Navigate to="/login" replace />;
      }
      return <TenantDashboard user={user} />;
    
    case 'PLATFORM_ADMIN':
    case 'PLATFORM_USER':
      return <PlatformDashboard user={user} />;
    
    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRouter;
