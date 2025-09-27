import React from 'react';
import { PermissionTableColumn, PermissionButton } from './PermissionAwareComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
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
  MoreHorizontal
} from 'lucide-react';

export const UserManagementTable: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'PLATFORM_ADMIN', status: 'Active', tenant: 'Platform' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'TENANT_ADMIN', status: 'Active', tenant: 'Tenant A' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'MARKETPLACE_DEVELOPER', status: 'Active', tenant: 'Platform' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'TENANT_USER', status: 'Inactive', tenant: 'Tenant B' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'END_CUSTOMER', status: 'Active', tenant: 'N/A' },
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <PermissionTableColumn feature="teams">
                <TableHead>Role</TableHead>
              </PermissionTableColumn>
              <TableHead>Status</TableHead>
              <PermissionTableColumn feature="tenants" requireFullAccess>
                <TableHead>Tenant</TableHead>
              </PermissionTableColumn>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <PermissionTableColumn feature="teams">
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                </PermissionTableColumn>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <PermissionTableColumn feature="tenants" requireFullAccess>
                  <TableCell>{user.tenant}</TableCell>
                </PermissionTableColumn>
                <TableCell>
                  <div className="flex space-x-2">
                    <PermissionButton feature="teams" variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="teams" variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="teams" variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </PermissionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const CustomerManagementTable: React.FC = () => {
  const customers = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', tier: 'Enterprise', status: 'Active', revenue: '$50,000' },
    { id: 2, name: 'TechStart Inc', email: 'info@techstart.com', tier: 'Premium', status: 'Active', revenue: '$25,000' },
    { id: 3, name: 'SmallBiz LLC', email: 'hello@smallbiz.com', tier: 'Basic', status: 'Inactive', revenue: '$5,000' },
    { id: 4, name: 'Global Corp', email: 'support@global.com', tier: 'Enterprise', status: 'Active', revenue: '$100,000' },
    { id: 5, name: 'Local Shop', email: 'owner@localshop.com', tier: 'Basic', status: 'Active', revenue: '$2,000' },
  ];

  const getTierBadge = (tier: string) => {
    const tierColors = {
      'Basic': 'bg-gray-100 text-gray-800',
      'Premium': 'bg-blue-100 text-blue-800',
      'Enterprise': 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={tierColors[tier as keyof typeof tierColors] || 'bg-gray-100 text-gray-800'}>
        {tier}
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Customer Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <PermissionTableColumn feature="analytics">
                <TableHead>Revenue</TableHead>
              </PermissionTableColumn>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{getTierBadge(customer.tier)}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <PermissionTableColumn feature="analytics">
                  <TableCell className="font-semibold text-green-600">{customer.revenue}</TableCell>
                </PermissionTableColumn>
                <TableCell>
                  <div className="flex space-x-2">
                    <PermissionButton feature="customers" variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="customers" variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="customers" variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </PermissionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const APIManagementTable: React.FC = () => {
  const apis = [
    { id: 1, name: 'User API', endpoint: '/api/users', method: 'GET', status: 'Active', requests: '2.4M', rate: '1000/min' },
    { id: 2, name: 'Auth API', endpoint: '/api/auth', method: 'POST', status: 'Active', requests: '1.8M', rate: '500/min' },
    { id: 3, name: 'Payment API', endpoint: '/api/payments', method: 'POST', status: 'Maintenance', requests: '890K', rate: '200/min' },
    { id: 4, name: 'Analytics API', endpoint: '/api/analytics', method: 'GET', status: 'Active', requests: '3.2M', rate: '2000/min' },
    { id: 5, name: 'Notification API', endpoint: '/api/notifications', method: 'POST', status: 'Active', requests: '1.5M', rate: '800/min' },
  ];

  const getMethodBadge = (method: string) => {
    const methodColors = {
      'GET': 'bg-green-100 text-green-800',
      'POST': 'bg-blue-100 text-blue-800',
      'PUT': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={methodColors[method as keyof typeof methodColors] || 'bg-gray-100 text-gray-800'}>
        {method}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>API Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Name</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Rate Limit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apis.map((api) => (
              <TableRow key={api.id}>
                <TableCell className="font-medium">{api.name}</TableCell>
                <TableCell className="font-mono text-sm">{api.endpoint}</TableCell>
                <TableCell>{getMethodBadge(api.method)}</TableCell>
                <TableCell>{getStatusBadge(api.status)}</TableCell>
                <TableCell className="font-semibold">{api.requests}</TableCell>
                <TableCell className="font-semibold text-blue-600">{api.rate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <PermissionButton feature="api" variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="api" variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="api" variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </PermissionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const TenantManagementTable: React.FC = () => {
  const tenants = [
    { id: 1, name: 'Acme Corporation', subdomain: 'acme', users: 150, status: 'Active', plan: 'Enterprise', revenue: '$50,000' },
    { id: 2, name: 'TechStart Inc', subdomain: 'techstart', users: 75, status: 'Active', plan: 'Premium', revenue: '$25,000' },
    { id: 3, name: 'SmallBiz LLC', subdomain: 'smallbiz', users: 25, status: 'Inactive', plan: 'Basic', revenue: '$5,000' },
    { id: 4, name: 'Global Corp', subdomain: 'global', users: 300, status: 'Active', plan: 'Enterprise', revenue: '$100,000' },
    { id: 5, name: 'Local Shop', subdomain: 'local', users: 10, status: 'Active', plan: 'Basic', revenue: '$2,000' },
  ];

  const getPlanBadge = (plan: string) => {
    const planColors = {
      'Basic': 'bg-gray-100 text-gray-800',
      'Premium': 'bg-blue-100 text-blue-800',
      'Enterprise': 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={planColors[plan as keyof typeof planColors] || 'bg-gray-100 text-gray-800'}>
        {plan}
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <span>Tenant Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Name</TableHead>
              <TableHead>Subdomain</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <PermissionTableColumn feature="analytics">
                <TableHead>Revenue</TableHead>
              </PermissionTableColumn>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell className="font-mono text-sm">{tenant.subdomain}</TableCell>
                <TableCell className="font-semibold">{tenant.users}</TableCell>
                <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                <PermissionTableColumn feature="analytics">
                  <TableCell className="font-semibold text-green-600">{tenant.revenue}</TableCell>
                </PermissionTableColumn>
                <TableCell>
                  <div className="flex space-x-2">
                    <PermissionButton feature="tenants" variant="outline" size="sm" requireFullAccess>
                      <Eye className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="tenants" variant="outline" size="sm" requireFullAccess>
                      <Edit className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton feature="tenants" variant="outline" size="sm" requireFullAccess>
                      <Settings className="w-4 h-4" />
                    </PermissionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
