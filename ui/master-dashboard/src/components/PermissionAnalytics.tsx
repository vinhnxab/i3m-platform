import React, { useState, useEffect } from 'react';
import { useAdvancedPermissions } from '@/hooks/useAdvancedPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
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
  Shield, 
  BarChart3,
  TrendingUp,
  Clock,
  Activity,
  RefreshCw,
  Download,
  ShieldAlert,
  TrendingDown
} from 'lucide-react';

// Analytics data interfaces
interface PermissionUsage {
  permission: string;
  resource: string;
  action: string;
  usageCount: number;
  lastUsed: Date;
  users: string[];
  trend: 'up' | 'down' | 'stable';
}

interface RoleAnalytics {
  role: string;
  userCount: number;
  permissionCount: number;
  activeUsers: number;
  inactiveUsers: number;
  avgPermissionsPerUser: number;
  mostUsedPermissions: string[];
  leastUsedPermissions: string[];
}

interface UserAnalytics {
  userId: string;
  name: string;
  email: string;
  role: string;
  permissionCount: number;
  lastActive: Date;
  loginCount: number;
  avgSessionDuration: number;
  mostUsedFeatures: string[];
  permissionEfficiency: number;
}

interface SecurityAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  failedLogins: number;
  suspiciousActivity: number;
  permissionViolations: number;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const PermissionAnalytics: React.FC = () => {
  // const { 
  //   getUserPermissions, 
  //   hasResourcePermission, 
  //   canManageResource,
  //   getResourcePermissionLevel,
  //   user 
  // } = useAdvancedPermissions();

  const [permissionUsage, setPermissionUsage] = useState<PermissionUsage[]>([]);
  const [roleAnalytics, setRoleAnalytics] = useState<RoleAnalytics[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [securityAnalytics, setSecurityAnalytics] = useState<SecurityAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  // Sample analytics data
  useEffect(() => {
    const samplePermissionUsage: PermissionUsage[] = [
      {
        permission: 'users.read',
        resource: 'users',
        action: 'read',
        usageCount: 1250,
        lastUsed: new Date(),
        users: ['user1', 'user2', 'user3'],
        trend: 'up'
      },
      {
        permission: 'customers.create',
        resource: 'customers',
        action: 'create',
        usageCount: 890,
        lastUsed: new Date(),
        users: ['user1', 'user4'],
        trend: 'up'
      },
      {
        permission: 'analytics.export',
        resource: 'analytics',
        action: 'export',
        usageCount: 450,
        lastUsed: new Date(),
        users: ['user2', 'user5'],
        trend: 'down'
      },
      {
        permission: 'api.manage',
        resource: 'api',
        action: 'manage',
        usageCount: 320,
        lastUsed: new Date(),
        users: ['user3'],
        trend: 'stable'
      },
      {
        permission: 'tenants.delete',
        resource: 'tenants',
        action: 'delete',
        usageCount: 15,
        lastUsed: new Date(),
        users: ['user1'],
        trend: 'stable'
      }
    ];

    const sampleRoleAnalytics: RoleAnalytics[] = [
      {
        role: 'PLATFORM_ADMIN',
        userCount: 5,
        permissionCount: 45,
        activeUsers: 5,
        inactiveUsers: 0,
        avgPermissionsPerUser: 9.0,
        mostUsedPermissions: ['users.manage', 'tenants.manage', 'analytics.manage'],
        leastUsedPermissions: ['backup.restore', 'security.manage']
      },
      {
        role: 'TENANT_ADMIN',
        userCount: 25,
        permissionCount: 35,
        activeUsers: 23,
        inactiveUsers: 2,
        avgPermissionsPerUser: 1.4,
        mostUsedPermissions: ['users.manage', 'customers.manage', 'analytics.read'],
        leastUsedPermissions: ['tenants.manage', 'api.manage']
      },
      {
        role: 'MARKETPLACE_DEVELOPER',
        userCount: 15,
        permissionCount: 25,
        activeUsers: 14,
        inactiveUsers: 1,
        avgPermissionsPerUser: 1.7,
        mostUsedPermissions: ['api.manage', 'content.manage', 'analytics.read'],
        leastUsedPermissions: ['users.manage', 'tenants.manage']
      },
      {
        role: 'TENANT_USER',
        userCount: 150,
        permissionCount: 15,
        activeUsers: 142,
        inactiveUsers: 8,
        avgPermissionsPerUser: 0.1,
        mostUsedPermissions: ['customers.read', 'content.read'],
        leastUsedPermissions: ['users.manage', 'analytics.manage']
      },
      {
        role: 'END_CUSTOMER',
        userCount: 500,
        permissionCount: 10,
        activeUsers: 480,
        inactiveUsers: 20,
        avgPermissionsPerUser: 0.02,
        mostUsedPermissions: ['content.read', 'ecommerce.read'],
        leastUsedPermissions: ['users.manage', 'tenants.manage']
      }
    ];

    const sampleUserAnalytics: UserAnalytics[] = [
      {
        userId: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'PLATFORM_ADMIN',
        permissionCount: 45,
        lastActive: new Date(),
        loginCount: 156,
        avgSessionDuration: 45,
        mostUsedFeatures: ['users.manage', 'tenants.manage', 'analytics.manage'],
        permissionEfficiency: 95
      },
      {
        userId: 'user2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'TENANT_ADMIN',
        permissionCount: 35,
        lastActive: new Date(),
        loginCount: 89,
        avgSessionDuration: 32,
        mostUsedFeatures: ['users.manage', 'customers.manage', 'analytics.read'],
        permissionEfficiency: 87
      },
      {
        userId: 'user3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'MARKETPLACE_DEVELOPER',
        permissionCount: 25,
        lastActive: new Date(),
        loginCount: 234,
        avgSessionDuration: 67,
        mostUsedFeatures: ['api.manage', 'content.manage', 'analytics.read'],
        permissionEfficiency: 92
      },
      {
        userId: 'user4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'TENANT_USER',
        permissionCount: 15,
        lastActive: new Date(),
        loginCount: 45,
        avgSessionDuration: 18,
        mostUsedFeatures: ['customers.read', 'content.read'],
        permissionEfficiency: 78
      },
      {
        userId: 'user5',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'END_CUSTOMER',
        permissionCount: 10,
        lastActive: new Date(),
        loginCount: 23,
        avgSessionDuration: 12,
        mostUsedFeatures: ['content.read', 'ecommerce.read'],
        permissionEfficiency: 65
      }
    ];

    const sampleSecurityAnalytics: SecurityAnalytics = {
      totalUsers: 695,
      activeUsers: 664,
      inactiveUsers: 31,
      failedLogins: 12,
      suspiciousActivity: 3,
      permissionViolations: 2,
      securityScore: 94,
      riskLevel: 'low'
    };

    setPermissionUsage(samplePermissionUsage);
    setRoleAnalytics(sampleRoleAnalytics);
    setUserAnalytics(sampleUserAnalytics);
    setSecurityAnalytics(sampleSecurityAnalytics);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Permission Analytics Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
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

      {/* Security Overview */}
      {securityAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityAnalytics.totalUsers}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="default">{securityAnalytics.activeUsers} active</Badge>
                <Badge variant="secondary">{securityAnalytics.inactiveUsers} inactive</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Security Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{securityAnalytics.securityScore}%</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getRiskLevelColor(securityAnalytics.riskLevel)}>
                  {securityAnalytics.riskLevel} risk
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Failed Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{securityAnalytics.failedLogins}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="destructive">{securityAnalytics.suspiciousActivity} suspicious</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Permission Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{securityAnalytics.permissionViolations}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">2 violations</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="permissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="permissions">Permission Usage</TabsTrigger>
          <TabsTrigger value="roles">Role Analytics</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Analytics</TabsTrigger>
        </TabsList>

        {/* Permission Usage Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionUsage.map((usage, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{usage.permission}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{usage.resource}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{usage.action}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{usage.usageCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(usage.trend)}
                          <span className="text-sm capitalize">{usage.trend}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {usage.lastUsed.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{usage.users.length} users</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Analytics Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roleAnalytics.map((role, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>{role.role}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Users</div>
                        <div className="text-2xl font-bold">{role.userCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                        <div className="text-2xl font-bold text-green-600">{role.activeUsers}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Permissions</div>
                        <div className="text-xl font-semibold">{role.permissionCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg per User</div>
                        <div className="text-xl font-semibold">{role.avgPermissionsPerUser}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Most Used Permissions</div>
                      <div className="flex flex-wrap gap-1">
                        {role.mostUsedPermissions.map((permission, idx) => (
                          <Badge key={idx} variant="default" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Least Used Permissions</div>
                      <div className="flex flex-wrap gap-1">
                        {role.leastUsedPermissions.map((permission, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Analytics Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Login Count</TableHead>
                    <TableHead>Avg Session</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAnalytics.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.permissionCount}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{user.loginCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.avgSessionDuration} min
                      </TableCell>
                      <TableCell>
                        <div className={`font-semibold ${getEfficiencyColor(user.permissionEfficiency)}`}>
                          {user.permissionEfficiency}%
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActive.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Analytics Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Security Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Security Score</span>
                    <span className="text-2xl font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <Badge className={getRiskLevelColor('low')}>Low Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Failed Logins</span>
                    <span className="text-lg font-semibold text-red-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Suspicious Activity</span>
                    <span className="text-lg font-semibold text-orange-600">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Permission Violations</span>
                    <span className="text-lg font-semibold text-yellow-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Activity Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Login Attempts</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Permission Usage</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Security Events</span>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">-5%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User Activity</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
