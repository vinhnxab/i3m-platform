import React from 'react';
import { useSelector } from 'react-redux';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import TenantDashboard from '@/pages/TenantDashboard';
import Dashboard from '@/pages/Dashboard';

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
      assignedTenants?: Array<{
        id: string;
        name: string;
        subdomain: string;
      }>;
    };
  };
}

const DashboardWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Route based on user role
  switch (user.role) {
    case 'MARKETPLACE_DEVELOPER':
      return <DeveloperDashboard user={user} />;
    
    case 'TENANT_ADMIN':
    case 'TENANT_USER':
      if (!user.tenantId || !user.tenant) {
        return <div>Tenant information not available</div>;
      }
      return <TenantDashboard user={user} />;
    
    case 'PLATFORM_ADMIN':
    case 'PLATFORM_USER':
      return <Dashboard />;
    
    default:
      return <div>Invalid user role</div>;
  }
};

export default DashboardWrapper;
