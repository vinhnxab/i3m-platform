import React from 'react';
import { useAdvancedPermissions } from '@/hooks/useAdvancedPermissions';
import { 
  ResourceManagementCard, 
  PermissionDataTable, 
  PermissionForm, 
  PermissionDataVisualization,
  PermissionStatus 
} from './AdvancedPermissionComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  Building,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Plus,
  Download,
  Upload,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Activity
} from 'lucide-react';

export const AdvancedPermissionDashboard: React.FC = () => {
  const { 
    getUserPermissions, 
    hasResourcePermission, 
    canManageResource,
    getResourcePermissionLevel,
    user 
  } = useAdvancedPermissions();

  const userPermissions = getUserPermissions();
  const resources = ['users', 'customers', 'tenants', 'api', 'analytics', 'security', 'settings', 'backup', 'teams', 'content', 'ecommerce', 'support', 'chat'];

  // Sample data for tables
  const userData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'PLATFORM_ADMIN', status: 'Active', tenant: 'Platform' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'TENANT_ADMIN', status: 'Active', tenant: 'Tenant A' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'MARKETPLACE_DEVELOPER', status: 'Active', tenant: 'Platform' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'TENANT_USER', status: 'Inactive', tenant: 'Tenant B' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'END_CUSTOMER', status: 'Active', tenant: 'N/A' },
  ];

  const customerData = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', tier: 'Enterprise', status: 'Active', revenue: '$50,000' },
    { id: 2, name: 'TechStart Inc', email: 'info@techstart.com', tier: 'Premium', status: 'Active', revenue: '$25,000' },
    { id: 3, name: 'SmallBiz LLC', email: 'hello@smallbiz.com', tier: 'Basic', status: 'Inactive', revenue: '$5,000' },
    { id: 4, name: 'Global Corp', email: 'support@global.com', tier: 'Enterprise', status: 'Active', revenue: '$100,000' },
    { id: 5, name: 'Local Shop', email: 'owner@localshop.com', tier: 'Basic', status: 'Active', revenue: '$2,000' },
  ];

  const getRoleBadge = (role: string) => {
    const roleColors = {
      'PLATFORM_ADMIN': 'bg-red-100 text-red-800',
      'PLATFORM_USER': 'bg-blue-100 text-blue-800',
      'TENANT_ADMIN': 'bg-green-100 text-green-800',
      'TENANT_USER': 'bg-yellow-100 text-yellow-800',
      'MARKETPLACE_DEVELOPER': 'bg-orange-100 text-orange-800',
      'END_CUSTOMER': 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* User Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Advanced Permission System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">User Role</h3>
                <p className="text-sm text-muted-foreground">{user?.role}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Total Permissions</h3>
                <p className="text-sm text-muted-foreground">{userPermissions.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Tenant ID</h3>
                <p className="text-sm text-muted-foreground">{user?.tenantId || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Resource Permissions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {resources.map(resource => (
                  <div key={resource} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm capitalize">{resource}</span>
                    <PermissionStatus resource={resource} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResourceManagementCard 
          resource="users" 
          title="User Management" 
          description="Manage platform users and permissions"
          icon={Users}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="font-semibold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-600">1,156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New This Month</span>
              <span className="font-semibold text-blue-600">+78</span>
            </div>
          </div>
        </ResourceManagementCard>

        <ResourceManagementCard 
          resource="customers" 
          title="Customer Management" 
          description="Manage customer relationships and data"
          icon={UserCheck}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Customers</span>
              <span className="font-semibold">2,456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-600">2,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="font-semibold text-green-600">$123,456</span>
            </div>
          </div>
        </ResourceManagementCard>

        <ResourceManagementCard 
          resource="tenants" 
          title="Tenant Management" 
          description="Manage platform tenants and billing"
          icon={Building}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Tenants</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-600">142</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="font-semibold text-green-600">$456,789</span>
            </div>
          </div>
        </ResourceManagementCard>
      </div>

      {/* Permission-based Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionDataTable
          resource="users"
          data={userData}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { 
              key: 'role', 
              label: 'Role',
              render: (value) => getRoleBadge(value)
            },
            { 
              key: 'status', 
              label: 'Status',
              render: (value) => getStatusBadge(value)
            },
            { 
              key: 'tenant', 
              label: 'Tenant',
              permission: 'tenants.read'
            }
          ]}
          actions={[
            { label: 'View', action: 'read', icon: Eye },
            { label: 'Edit', action: 'update', icon: Edit },
            { label: 'Delete', action: 'delete', icon: Trash2 }
          ]}
        />

        <PermissionDataTable
          resource="customers"
          data={customerData}
          columns={[
            { key: 'name', label: 'Company' },
            { key: 'email', label: 'Email' },
            { key: 'tier', label: 'Tier' },
            { 
              key: 'status', 
              label: 'Status',
              render: (value) => getStatusBadge(value)
            },
            { 
              key: 'revenue', 
              label: 'Revenue',
              permission: 'analytics.read'
            }
          ]}
          actions={[
            { label: 'View', action: 'read', icon: Eye },
            { label: 'Edit', action: 'update', icon: Edit },
            { label: 'More', action: 'manage', icon: MoreHorizontal }
          ]}
        />
      </div>

      {/* Permission-based Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionForm resource="users">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input className="w-full p-2 border rounded" placeholder="Enter first name" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input className="w-full p-2 border rounded" placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input className="w-full p-2 border rounded" type="email" placeholder="Enter email" />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <select className="w-full p-2 border rounded">
                <option>PLATFORM_ADMIN</option>
                <option>PLATFORM_USER</option>
                <option>TENANT_ADMIN</option>
                <option>TENANT_USER</option>
                <option>MARKETPLACE_DEVELOPER</option>
                <option>END_CUSTOMER</option>
              </select>
            </div>
          </div>
        </PermissionForm>

        <PermissionForm resource="customers">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <input className="w-full p-2 border rounded" placeholder="Enter company name" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input className="w-full p-2 border rounded" type="email" placeholder="Enter email" />
            </div>
            <div>
              <label className="text-sm font-medium">Tier</label>
              <select className="w-full p-2 border rounded">
                <option>Basic</option>
                <option>Premium</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select className="w-full p-2 border rounded">
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
        </PermissionForm>
      </div>

      {/* Permission-based Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionDataVisualization 
          resource="analytics" 
          title="Analytics Dashboard"
          filters={{ tenantId: user?.tenantId }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-600">$123,456</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Growth Rate</h3>
                <p className="text-2xl font-bold text-blue-600">+15.3%</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Revenue Trend</h3>
              <div className="h-32 bg-muted rounded flex items-center justify-center">
                <span className="text-muted-foreground">Chart Placeholder</span>
              </div>
            </div>
          </div>
        </PermissionDataVisualization>

        <PermissionDataVisualization 
          resource="security" 
          title="Security Dashboard"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Threats Detected</h3>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Protection Level</h3>
                <p className="text-2xl font-bold text-green-600">99.9%</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Security Events</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Failed Login Attempts</span>
                  <Badge variant="destructive">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Suspicious Activity</span>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Updates</span>
                  <Badge variant="default">12</Badge>
                </div>
              </div>
            </div>
          </div>
        </PermissionDataVisualization>
      </div>

      {/* Permission Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Permission Testing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Resource Permission Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {resources.map(resource => (
                <div key={resource} className="p-4 border rounded-lg">
                  <h4 className="font-medium capitalize mb-2">{resource}</h4>
                  <div className="space-y-1">
                    <PermissionStatus resource={resource} action="read" />
                    <PermissionStatus resource={resource} action="create" />
                    <PermissionStatus resource={resource} action="update" />
                    <PermissionStatus resource={resource} action="delete" />
                    <PermissionStatus resource={resource} action="manage" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
