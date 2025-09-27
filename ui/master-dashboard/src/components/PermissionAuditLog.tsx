import React, { useState, useEffect } from 'react';
import { useAdvancedPermissions } from '@/hooks/useAdvancedPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
  ShieldAlert,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  AlertCircle,
  Info,
  Target,
  Zap,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  FileText,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';

// Audit log interfaces
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  permission: string;
  result: 'success' | 'failure' | 'denied';
  ipAddress: string;
  userAgent: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tenantId?: string;
  sessionId: string;
}

interface PermissionChange {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'granted' | 'revoked' | 'modified';
  permission: string;
  oldValue?: string;
  newValue?: string;
  reason: string;
  approvedBy?: string;
  tenantId?: string;
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  eventType: 'login' | 'logout' | 'permission_denied' | 'suspicious_activity' | 'data_access' | 'configuration_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  resolved: boolean;
  tenantId?: string;
}

export const PermissionAuditLog: React.FC = () => {
  const { 
    getUserPermissions, 
    hasResourcePermission, 
    canManageResource,
    getResourcePermissionLevel,
    user 
  } = useAdvancedPermissions();

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [permissionChanges, setPermissionChanges] = useState<PermissionChange[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterResult, setFilterResult] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('7d');

  // Sample audit data
  useEffect(() => {
    const sampleAuditLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: new Date(),
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        userRole: 'PLATFORM_ADMIN',
        action: 'read',
        resource: 'users',
        permission: 'users.read',
        result: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Accessed user management page',
        severity: 'low',
        tenantId: 'platform',
        sessionId: 'sess_123456'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        userRole: 'TENANT_ADMIN',
        action: 'create',
        resource: 'customers',
        permission: 'customers.create',
        result: 'success',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: 'Created new customer record',
        severity: 'low',
        tenantId: 'tenant-a',
        sessionId: 'sess_123457'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000),
        userId: 'user3',
        userName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        userRole: 'MARKETPLACE_DEVELOPER',
        action: 'manage',
        resource: 'api',
        permission: 'api.manage',
        result: 'success',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        details: 'Updated API configuration',
        severity: 'medium',
        tenantId: 'platform',
        sessionId: 'sess_123458'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 10800000),
        userId: 'user4',
        userName: 'Alice Brown',
        userEmail: 'alice@example.com',
        userRole: 'TENANT_USER',
        action: 'delete',
        resource: 'users',
        permission: 'users.delete',
        result: 'denied',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Attempted to delete user without permission',
        severity: 'high',
        tenantId: 'tenant-b',
        sessionId: 'sess_123459'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 14400000),
        userId: 'user5',
        userName: 'Charlie Wilson',
        userEmail: 'charlie@example.com',
        userRole: 'END_CUSTOMER',
        action: 'read',
        resource: 'analytics',
        permission: 'analytics.read',
        result: 'denied',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        details: 'Attempted to access analytics without permission',
        severity: 'medium',
        tenantId: 'tenant-c',
        sessionId: 'sess_123460'
      }
    ];

    const samplePermissionChanges: PermissionChange[] = [
      {
        id: '1',
        timestamp: new Date(),
        userId: 'user1',
        userName: 'John Doe',
        action: 'granted',
        permission: 'users.manage',
        newValue: 'PLATFORM_ADMIN',
        reason: 'Promoted to platform administrator',
        approvedBy: 'system',
        tenantId: 'platform'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        userId: 'user2',
        userName: 'Jane Smith',
        action: 'revoked',
        permission: 'tenants.manage',
        oldValue: 'TENANT_ADMIN',
        reason: 'Role changed to tenant user',
        approvedBy: 'user1',
        tenantId: 'tenant-a'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000),
        userId: 'user3',
        userName: 'Bob Johnson',
        action: 'modified',
        permission: 'api.manage',
        oldValue: 'MARKETPLACE_DEVELOPER',
        newValue: 'MARKETPLACE_DEVELOPER',
        reason: 'Permission scope updated',
        approvedBy: 'user1',
        tenantId: 'platform'
      }
    ];

    const sampleSecurityEvents: SecurityEvent[] = [
      {
        id: '1',
        timestamp: new Date(),
        userId: 'user1',
        userName: 'John Doe',
        eventType: 'login',
        severity: 'low',
        description: 'Successful login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'User logged in successfully',
        resolved: true,
        tenantId: 'platform'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        userId: 'user4',
        userName: 'Alice Brown',
        eventType: 'permission_denied',
        severity: 'high',
        description: 'Permission denied for user deletion',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'User attempted to delete another user without permission',
        resolved: false,
        tenantId: 'tenant-b'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000),
        userId: 'user5',
        userName: 'Charlie Wilson',
        eventType: 'suspicious_activity',
        severity: 'critical',
        description: 'Multiple failed login attempts',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        details: 'User attempted to login 5 times with wrong password',
        resolved: false,
        tenantId: 'tenant-c'
      }
    ];

    setAuditLogs(sampleAuditLogs);
    setPermissionChanges(samplePermissionChanges);
    setSecurityEvents(sampleSecurityEvents);
  }, []);

  // Filter functions
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesResult = filterResult === 'all' || log.result === filterResult;
    return matchesSearch && matchesSeverity && matchesResult;
  });

  const filteredPermissionChanges = permissionChanges.filter(change => {
    const matchesSearch = change.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.permission.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.action.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredSecurityEvents = securityEvents.filter(event => {
    const matchesSearch = event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failure':
        return 'text-red-600 bg-red-100';
      case 'denied':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'logout':
        return <UserMinus className="w-4 h-4 text-blue-600" />;
      case 'permission_denied':
        return <ShieldX className="w-4 h-4 text-red-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'data_access':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'configuration_change':
        return <Settings className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Permission Audit Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <select 
                value={filterSeverity} 
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select 
                value={filterResult} 
                onChange={(e) => setFilterResult(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Results</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="denied">Denied</option>
              </select>
              <select 
                value={filterDateRange} 
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
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
      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="permissions">Permission Changes</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                          <Badge variant="outline" className="text-xs">{log.userRole}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{log.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.resource}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.permission}</TableCell>
                      <TableCell>
                        <Badge className={getResultColor(log.result)}>
                          {log.result}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={log.details}>
                          {log.details}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permission Changes Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissionChanges.map((change) => (
                    <TableRow key={change.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {change.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{change.userName}</div>
                          <div className="text-sm text-muted-foreground">{change.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          change.action === 'granted' ? 'default' :
                          change.action === 'revoked' ? 'destructive' : 'secondary'
                        }>
                          {change.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{change.permission}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {change.oldValue || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {change.newValue || '—'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={change.reason}>
                        {change.reason}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {change.approvedBy || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSecurityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {event.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.userName}</div>
                          <div className="text-sm text-muted-foreground">{event.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getEventTypeIcon(event.eventType)}
                          <span className="text-sm capitalize">{event.eventType.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={event.description}>
                        {event.description}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.ipAddress}</TableCell>
                      <TableCell>
                        <Badge variant={event.resolved ? 'default' : 'destructive'}>
                          {event.resolved ? 'Resolved' : 'Open'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={event.details}>
                        {event.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
