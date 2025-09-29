import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { 
  Login, 
  Register, 
  Dashboard, 
  ForgotPassword,
  Overview,
  SupportManagement,
  TemplateMarketplace,
  ServiceMarketplace,
  CustomerManagement,
  ScrumManagement,
  AIMLDashboard,
  WorkflowManagement,
  SecurityCenter,
  PerformanceMonitoring,
  TenantManagement,
  TeamManagement,
  BackupManagement,
  APIManagement,
  SettingsPanel,
  Analytics,
  CMSManagement,
  ERPManagement,
  EcommerceManagement,
  LiveChat
} from '@/pages';
import DashboardTest from '@/pages/DashboardTest';
import UserManagement  from '@/pages/UserManagement';
import DashboardWrapper from '@/components/DashboardWrapper';
import NotFound from '@/pages/NotFound';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import { LayoutWrapper } from '@/shared/components/layout';


// Create router configuration
export const router = createBrowserRouter([
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
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      
      // Protected routes
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'overview',
        element: (
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard-test',
        element: (
          <ProtectedRoute>
            <DashboardTest />
          </ProtectedRoute>
        ),
      },
      
      // Role-based Dashboard Routes
      {
        path: 'developer/dashboard',
        element: (
          <ProtectedRoute requiredRole="MARKETPLACE_DEVELOPER">
            <DashboardWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tenant/dashboard',
        element: (
          <ProtectedRoute requiredRole={['TENANT_ADMIN', 'TENANT_USER']}>
            <DashboardWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'customer/dashboard',
        element: (
          <ProtectedRoute requiredRole="END_CUSTOMER">
            <DashboardWrapper />
          </ProtectedRoute>
        ),
      },
      // Feature-based routes with permissions
      {
        path: 'analytics',
        element: (
          <ProtectedRoute requiredFeature="analytics">
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: 'customers',
        element: (
          <ProtectedRoute requiredFeature="customers">
            <CustomerManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ecommerce',
        element: (
          <ProtectedRoute requiredFeature="ecommerce">
            <EcommerceManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'erp',
        element: (
          <ProtectedRoute requiredFeature="erp">
            <ERPManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cms',
        element: (
          <ProtectedRoute requiredFeature="cms">
            <CMSManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'livechat',
        element: (
          <ProtectedRoute requiredFeature="livechat">
            <LiveChat />
          </ProtectedRoute>
        ),
      },
      {
        path: 'support',
        element: (
          <ProtectedRoute requiredFeature="support">
            <SupportManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'templates',
        element: (
          <ProtectedRoute requiredFeature="templates">
            <TemplateMarketplace />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services',
        element: (
          <ProtectedRoute requiredFeature="services">
            <ServiceMarketplace />
          </ProtectedRoute>
        ),
      },
      {
        path: 'scrum',
        element: (
          <ProtectedRoute requiredFeature="scrum">
            <ScrumManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'workflow',
        element: (
          <ProtectedRoute requiredFeature="workflow">
            <WorkflowManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'aiml',
        element: (
          <ProtectedRoute requiredFeature="aiml">
            <AIMLDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'security',
        element: (
          <ProtectedRoute requiredFeature="security">
            <SecurityCenter />
          </ProtectedRoute>
        ),
      },
      {
        path: 'performance',
        element: (
          <ProtectedRoute requiredFeature="performance">
            <PerformanceMonitoring />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tenants',
        element: (
          <ProtectedRoute requiredFeature="tenants" requireFullAccess>
            <TenantManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams',
        element: (
          <ProtectedRoute requiredFeature="teams">
            <TeamManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'backup',
        element: (
          <ProtectedRoute requiredFeature="backup">
            <BackupManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'api',
        element: (
          <ProtectedRoute requiredFeature="api">
            <APIManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredFeature="settings">
            <SettingsPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredFeature="users">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      
      // 404 Not Found route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

// Router Provider Component
export function AppRouter() {
  return <RouterProvider router={router} />;
}
