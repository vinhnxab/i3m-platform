import React, { useState, useEffect } from 'react';
import { useAdvancedPermissions } from '@/hooks/useAdvancedPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Switch } from '@/shared/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/shared/components/ui/tabs';
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
  Activity,
  Search,
  Filter,
  RefreshCw,
  Save,
  X,
  UserPlus,
  UserMinus,
  UserCog,
  ShieldCheck,
  ShieldX,
  ShieldAlert
} from 'lucide-react';

// Permission management interface
interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  customPermissions: string[];
  isActive: boolean;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PermissionManagement: React.FC = () => {
  const { 
    getUserPermissions, 
    hasResourcePermission, 
    canManageResource,
    getResourcePermissionLevel,
    user 
  } = useAdvancedPermissions();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  useEffect(() => {
    const samplePermissions: Permission[] = [
      {
        id: '1',
        name: 'User Management',
        description: 'Manage platform users and permissions',
        resource: 'users',
        action: 'manage',
        roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Customer Access',
        description: 'Access customer data and information',
        resource: 'customers',
        action: 'read',
        roles: ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Analytics Export',
        description: 'Export analytics data and reports',
        resource: 'analytics',
        action: 'export',
        roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const sampleRoles: Role[] = [
      {
        id: '1',
        name: 'PLATFORM_ADMIN',
        description: 'Platform Administrator with full access',
        permissions: ['users.manage', 'customers.manage', 'tenants.manage', 'analytics.manage'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'TENANT_ADMIN',
        description: 'Tenant Administrator with limited access',
        permissions: ['users.manage', 'customers.manage', 'analytics.read'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'DEVELOPER',
        description: 'Developer with API and development access',
        permissions: ['api.manage', 'content.manage', 'analytics.read'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'PLATFORM_ADMIN',
        permissions: ['users.manage', 'customers.manage', 'tenants.manage'],
        customPermissions: ['special.access'],
        isActive: true,
        tenantId: 'platform',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'TENANT_ADMIN',
        permissions: ['users.manage', 'customers.manage'],
        customPermissions: [],
        isActive: true,
        tenantId: 'tenant-a',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'DEVELOPER',
        permissions: ['api.manage', 'content.manage'],
        customPermissions: ['debug.access'],
        isActive: true,
        tenantId: 'platform',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setPermissions(samplePermissions);
    setRoles(sampleRoles);
    setUsers(sampleUsers);
  }, []);

  // Filter functions
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && permission.isActive) ||
                         (filterStatus === 'inactive' && !permission.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && role.isActive) ||
                         (filterStatus === 'inactive' && !role.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Permission management functions
  const handleCreatePermission = () => {
    const newPermission: Permission = {
      id: Date.now().toString(),
      name: 'New Permission',
      description: 'New permission description',
      resource: 'users',
      action: 'read',
      roles: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPermissions([...permissions, newPermission]);
    setSelectedPermission(newPermission);
  };

  const handleUpdatePermission = (permission: Permission) => {
    setPermissions(permissions.map(p => p.id === permission.id ? permission : p));
    setSelectedPermission(null);
  };

  const handleDeletePermission = (permissionId: string) => {
    setPermissions(permissions.filter(p => p.id !== permissionId));
    setSelectedPermission(null);
  };

  const handleCreateRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: 'NEW_ROLE',
      description: 'New role description',
      permissions: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
  };

  const handleUpdateRole = (role: Role) => {
    setRoles(roles.map(r => r.id === role.id ? role : r));
    setSelectedRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
    setSelectedRole(null);
  };

  const handleCreateUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: 'New User',
      email: 'newuser@example.com',
      role: 'TENANT_USER',
      permissions: [],
      customPermissions: [],
      isActive: true,
      tenantId: 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setUsers([...users, newUser]);
    setSelectedUser(newUser);
  };

  const handleUpdateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Permission Management System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions, roles, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
                  <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                  <SelectItem value="TENANT_USER">Tenant User</SelectItem>
                  <SelectItem value="END_CUSTOMER">End Customer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="permissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Permissions Management</h2>
            <Button onClick={handleCreatePermission}>
              <Plus className="w-4 h-4 mr-2" />
              Create Permission
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Permissions List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPermissions.map((permission) => (
                    <div key={permission.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{permission.name}</h3>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{permission.resource}</Badge>
                            <Badge variant="outline">{permission.action}</Badge>
                            <Badge variant={permission.isActive ? 'default' : 'secondary'}>
                              {permission.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPermission(permission)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePermission(permission.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedPermission && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Permission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="permissionName">Name</Label>
                    <Input
                      id="permissionName"
                      value={selectedPermission.name}
                      onChange={(e) => setSelectedPermission({
                        ...selectedPermission,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permissionDescription">Description</Label>
                    <Textarea
                      id="permissionDescription"
                      value={selectedPermission.description}
                      onChange={(e) => setSelectedPermission({
                        ...selectedPermission,
                        description: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="permissionResource">Resource</Label>
                      <Select
                        value={selectedPermission.resource}
                        onValueChange={(value) => setSelectedPermission({
                          ...selectedPermission,
                          resource: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="users">Users</SelectItem>
                          <SelectItem value="customers">Customers</SelectItem>
                          <SelectItem value="tenants">Tenants</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="settings">Settings</SelectItem>
                          <SelectItem value="backup">Backup</SelectItem>
                          <SelectItem value="teams">Teams</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="permissionAction">Action</Label>
                      <Select
                        value={selectedPermission.action}
                        onValueChange={(value) => setSelectedPermission({
                          ...selectedPermission,
                          action: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="create">Create</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
                          <SelectItem value="manage">Manage</SelectItem>
                          <SelectItem value="export">Export</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Allowed Roles</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'].map(role => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={selectedPermission.roles.includes(role)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPermission({
                                  ...selectedPermission,
                                  roles: [...selectedPermission.roles, role]
                                });
                              } else {
                                setSelectedPermission({
                                  ...selectedPermission,
                                  roles: selectedPermission.roles.filter(r => r !== role)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={role} className="text-sm">{role}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="permissionActive"
                      checked={selectedPermission.isActive}
                      onCheckedChange={(checked) => setSelectedPermission({
                        ...selectedPermission,
                        isActive: checked
                      })}
                    />
                    <Label htmlFor="permissionActive">Active</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleUpdatePermission(selectedPermission)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedPermission(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Roles Management</h2>
            <Button onClick={handleCreateRole}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRoles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{role.permissions.length} permissions</Badge>
                            <Badge variant={role.isActive ? 'default' : 'secondary'}>
                              {role.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRole(role)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedRole && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Name</Label>
                    <Input
                      id="roleName"
                      value={selectedRole.name}
                      onChange={(e) => setSelectedRole({
                        ...selectedRole,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      value={selectedRole.description}
                      onChange={(e) => setSelectedRole({
                        ...selectedRole,
                        description: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRole({
                                  ...selectedRole,
                                  permissions: [...selectedRole.permissions, permission.id]
                                });
                              } else {
                                setSelectedRole({
                                  ...selectedRole,
                                  permissions: selectedRole.permissions.filter(p => p !== permission.id)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={permission.id} className="text-sm">{permission.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="roleActive"
                      checked={selectedRole.isActive}
                      onCheckedChange={(checked) => setSelectedRole({
                        ...selectedRole,
                        isActive: checked
                      })}
                    />
                    <Label htmlFor="roleActive">Active</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleUpdateRole(selectedRole)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedRole(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Users Management</h2>
            <Button onClick={handleCreateUser}>
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Users List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{user.role}</Badge>
                            <Badge variant="outline">{user.permissions.length} permissions</Badge>
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Name</Label>
                    <Input
                      id="userName"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Role</Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) => setSelectedUser({
                        ...selectedUser,
                        role: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
                        <SelectItem value="PLATFORM_USER">Platform User</SelectItem>
                        <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                        <SelectItem value="TENANT_USER">Tenant User</SelectItem>
                        <SelectItem value="DEVELOPER">Developer</SelectItem>
                        <SelectItem value="END_CUSTOMER">End Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Custom Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedUser.customPermissions.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUser({
                                  ...selectedUser,
                                  customPermissions: [...selectedUser.customPermissions, permission.id]
                                });
                              } else {
                                setSelectedUser({
                                  ...selectedUser,
                                  customPermissions: selectedUser.customPermissions.filter(p => p !== permission.id)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={permission.id} className="text-sm">{permission.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="userActive"
                      checked={selectedUser.isActive}
                      onCheckedChange={(checked) => setSelectedUser({
                        ...selectedUser,
                        isActive: checked
                      })}
                    />
                    <Label htmlFor="userActive">Active</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleUpdateUser(selectedUser)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedUser(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
