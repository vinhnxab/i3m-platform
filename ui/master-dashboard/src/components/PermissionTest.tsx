import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard, PlatformGuard, TenantGuard, DeveloperGuard, CustomerGuard } from '@/components/auth/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { UserManagementForm, SystemSettingsForm, CustomerForm } from './PermissionForms';
import { UserManagementTable, CustomerManagementTable, APIManagementTable, TenantManagementTable } from './PermissionTables';

export const PermissionTest: React.FC = () => {
  const { user, isAuthenticated, canAccess, getPermissionLevel } = usePermissions();

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to test permissions.</p>
        </CardContent>
      </Card>
    );
  }

  const features = [
    'overview', 'analytics', 'customers', 'ecommerce', 'erp', 'cms',
    'livechat', 'support', 'templates', 'services', 'scrum', 'workflow',
    'aiml', 'security', 'performance', 'tenants', 'teams', 'backup', 'api', 'settings'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>User Roles:</strong> {user.userRoles?.join(', ') || 'N/A'}</p>
            <p><strong>Tenant ID:</strong> {user.tenantId || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map(feature => {
              const hasAccess = canAccess(feature as any);
              const permissionLevel = getPermissionLevel(feature as any);
              
              return (
                <div key={feature} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{feature}</span>
                    <Badge variant={hasAccess ? 'default' : 'secondary'}>
                      {permissionLevel}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hasAccess ? '✅ Access' : '❌ No Access'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role-Based Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PlatformGuard>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900">Platform Content</h3>
                <p className="text-blue-700">This content is only visible to Platform users.</p>
              </div>
            </PlatformGuard>

            <TenantGuard>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900">Tenant Content</h3>
                <p className="text-green-700">This content is only visible to Tenant users.</p>
              </div>
            </TenantGuard>

            <DeveloperGuard>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-900">Developer Content</h3>
                <p className="text-orange-700">This content is only visible to Developers.</p>
              </div>
            </DeveloperGuard>

            <CustomerGuard>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-900">Customer Content</h3>
                <p className="text-purple-700">This content is only visible to Customers.</p>
              </div>
            </CustomerGuard>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission-Aware Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <UserManagementForm />
            <SystemSettingsForm />
            <CustomerForm />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission-Aware Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <UserManagementTable />
            <CustomerManagementTable />
            <APIManagementTable />
            <TenantManagementTable />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature-Based Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PermissionGuard feature="analytics">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900">Analytics Content</h3>
                <p className="text-blue-700">This content is only visible to users with Analytics access.</p>
              </div>
            </PermissionGuard>

            <PermissionGuard feature="tenants">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900">Tenant Management</h3>
                <p className="text-red-700">This content is only visible to Platform Admins.</p>
              </div>
            </PermissionGuard>

            <PermissionGuard feature="api">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900">API Management</h3>
                <p className="text-yellow-700">This content is only visible to users with API access.</p>
              </div>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
