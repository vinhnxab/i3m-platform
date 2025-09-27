import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { ReduxProvider } from '../../store/ReduxProvider';
import { ThemeProvider, DesignSystemProvider, LanguageProvider } from '../providers';
import { Login, Dashboard } from '@/pages';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import { LayoutWrapper } from '@/shared/components/layout';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import TenantDashboard from '@/pages/TenantDashboard';

// Dashboard Router Component
const DashboardRouter: React.FC<{ user: any }> = ({ user }) => {
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
      return <Dashboard user={user} />;
    
    default:
      return <div>Invalid user role</div>;
  }
};

// Create router configuration with role-based routing
export const dashboardRouter = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      // Public routes
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      
      // Developer routes
      {
        path: 'developer/dashboard',
        element: (
          <ProtectedRoute requiredRole="MARKETPLACE_DEVELOPER">
            <DashboardRouter user={null} />
          </ProtectedRoute>
        ),
      },
      
      // Tenant routes
      {
        path: 'tenant/:tenantId/dashboard',
        element: (
          <ProtectedRoute requiredRole={['TENANT_ADMIN', 'TENANT_USER']}>
            <DashboardRouter user={null} />
          </ProtectedRoute>
        ),
      },
      
      
      // Default redirect
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      
      // Catch all route
      {
        path: '*',
        element: <Navigate to="/login" replace />,
      }
    ]
  }
]);

// Router Provider Component
export function DashboardAppRouter() {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <LanguageProvider defaultLanguage="en">
          <DesignSystemProvider defaultSystem="apple" defaultMode="system">
            <ThemeProvider defaultTheme="system" storageKey="i3m-theme">
              <RouterProvider router={dashboardRouter} />
            </ThemeProvider>
          </DesignSystemProvider>
        </LanguageProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
