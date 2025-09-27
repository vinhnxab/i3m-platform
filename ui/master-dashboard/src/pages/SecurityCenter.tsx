import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress } from '@/shared/components/ui';
import { mockSecurityStats, mockThreats, mockIncidents } from '../../mock-data/security';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Eye,
  Key,
  Fingerprint,
  Globe,
  Server,
  Database,
  UserCheck,
  Ban,
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Wifi,
  Smartphone,
  Monitor,
  Clock
} from 'lucide-react';

export function SecurityCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  const securityStats = mockSecurityStats;

  const threats = mockThreats;

  const complianceStatus = [
    { standard: 'GDPR', status: 'compliant', score: 98, lastAudit: '2024-01-10', nextAudit: '2024-04-10' },
    { standard: 'SOC 2', status: 'compliant', score: 96, lastAudit: '2024-01-05', nextAudit: '2024-07-05' },
    { standard: 'ISO 27001', status: 'compliant', score: 94, lastAudit: '2023-12-15', nextAudit: '2024-12-15' },
    { standard: 'PCI DSS', status: 'compliant', score: 99, lastAudit: '2024-01-08', nextAudit: '2024-04-08' },
    { standard: 'HIPAA', status: 'partial', score: 87, lastAudit: '2023-11-20', nextAudit: '2024-02-20' },
    { standard: 'SOX', status: 'compliant', score: 95, lastAudit: '2024-01-12', nextAudit: '2024-04-12' },
  ];

  const accessLogs = [
    {
      id: 1,
      user: 'admin@i3m.com',
      action: 'User Login',
      resource: 'Admin Dashboard',
      ip: '192.168.1.50',
      device: 'Desktop',
      location: 'New York, US',
      timestamp: '2024-01-15 14:45:30',
      status: 'success'
    },
    {
      id: 2,
      user: 'john.doe@techcorp.com',
      action: 'File Download',
      resource: 'Customer Data Export',
      ip: '203.45.67.123',
      device: 'Mobile',
      location: 'London, UK',
      timestamp: '2024-01-15 14:30:15',
      status: 'success'
    },
    {
      id: 3,
      user: 'unknown',
      action: 'Failed Login',
      resource: 'API Endpoint',
      ip: '45.123.45.67',
      device: 'Unknown',
      location: 'Unknown',
      timestamp: '2024-01-15 14:15:22',
      status: 'failed'
    },
    {
      id: 4,
      user: 'sarah@startupco.com',
      action: 'Data Modification',
      resource: 'Customer Profile',
      ip: '192.168.1.75',
      device: 'Tablet',
      location: 'San Francisco, US',
      timestamp: '2024-01-15 13:55:10',
      status: 'success'
    }
  ];

  const securityPolicies = [
    { name: 'Password Policy', status: 'active', lastUpdated: '2024-01-10', compliance: 100 },
    { name: 'Data Retention Policy', status: 'active', lastUpdated: '2024-01-08', compliance: 98 },
    { name: 'Access Control Policy', status: 'active', lastUpdated: '2024-01-12', compliance: 96 },
    { name: 'Incident Response Policy', status: 'active', lastUpdated: '2024-01-05', compliance: 94 },
    { name: 'Data Privacy Policy', status: 'review', lastUpdated: '2023-12-20', compliance: 89 },
    { name: 'Audit Trail Policy', status: 'active', lastUpdated: '2024-01-14', compliance: 99 },
  ];

  const vulnerabilities = [
    {
      id: 1,
      title: 'Outdated SSL Certificate',
      severity: 'medium',
      component: 'Web Server',
      description: 'SSL certificate expires in 30 days',
      status: 'open',
      assignee: 'DevOps Team',
      dueDate: '2024-02-01'
    },
    {
      id: 2,
      title: 'Weak Password Detected',
      severity: 'low',
      component: 'User Account',
      description: 'User account with weak password detected',
      status: 'resolved',
      assignee: 'Security Team',
      dueDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Unauthorized API Endpoint',
      severity: 'high',
      component: 'API Gateway',
      description: 'API endpoint without proper authentication',
      status: 'in-progress',
      assignee: 'Backend Team',
      dueDate: '2024-01-20'
    }
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Security Center</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Advanced security monitoring and threat detection</p>
        </div>
        <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            All Systems Operational
          </Badge>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Scan Now
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {securityStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground tracking-tight mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground font-medium">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span> from last week
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Health */}
            <Card>
              <CardHeader>
                <CardTitle>Security Health Score</CardTitle>
                <CardDescription>Overall security posture assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Score</span>
                    <span className="text-2xl font-bold text-green-600">94.7%</span>
                  </div>
                  <Progress value={94.7} className="h-3" />
                  <div className="space-y-3">
                    {[
                      { category: 'Access Control', score: 96, color: 'bg-green-500' },
                      { category: 'Data Protection', score: 98, color: 'bg-green-500' },
                      { category: 'Network Security', score: 92, color: 'bg-yellow-500' },
                      { category: 'Compliance', score: 89, color: 'bg-yellow-500' },
                      { category: 'Incident Response', score: 95, color: 'bg-green-500' },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span>{item.score}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full`} 
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>Latest security incidents and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threats.slice(0, 4).map((threat) => (
                    <div key={threat.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        threat.severity === 'critical' ? 'bg-red-500' :
                        threat.severity === 'high' ? 'bg-orange-500' :
                        threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{threat.type}</p>
                        <p className="text-sm text-muted-foreground font-medium">{threat.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={
                            threat.status === 'blocked' ? 'destructive' :
                            threat.status === 'mitigated' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {threat.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{threat.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Threat Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Threats Detected Today</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blocked Automatically</span>
                    <Badge variant="default">44</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Manual Review Required</span>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">False Positives</span>
                    <Badge variant="outline">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">2FA Enabled Users</span>
                    <Badge variant="default">98.7%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Failed Login Attempts</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Suspicious Logins</span>
                    <Badge variant="destructive">5</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Password Changes</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Encrypted Data</span>
                    <Badge variant="default">100%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Backups</span>
                    <Badge variant="default">Current</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Privacy Requests</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Breaches</span>
                    <Badge variant="default">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Threats Tab */}
        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Threats</CardTitle>
                  <CardDescription>Real-time threat detection and response</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div key={threat.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        threat.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        threat.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                        threat.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{threat.type}</h4>
                          <Badge variant={
                            threat.severity === 'critical' ? 'destructive' :
                            threat.severity === 'high' ? 'destructive' :
                            threat.severity === 'medium' ? 'secondary' : 'outline'
                          }>
                            {threat.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{threat.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Source: {threat.source}</span>
                          <span>Target: {threat.target}</span>
                          <span>{threat.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {threat.actions.map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        threat.status === 'blocked' ? 'destructive' :
                        threat.status === 'mitigated' ? 'secondary' : 'outline'
                      }>
                        {threat.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Monitor compliance with industry standards and regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {complianceStatus.map((compliance, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{compliance.standard}</h4>
                        <Badge variant={compliance.status === 'compliant' ? 'default' : 'secondary'}>
                          {compliance.status}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{compliance.score}%</span>
                    </div>
                    <Progress value={compliance.score} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last audit: {compliance.lastAudit}</span>
                      <span>Next audit: {compliance.nextAudit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityPolicies.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{policy.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">Updated: {policy.lastUpdated}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">{policy.compliance}%</span>
                        <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Log Entries</span>
                    <span className="font-medium">2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Retention Period</span>
                    <Badge variant="outline">7 years</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Integrity Checks</span>
                    <Badge variant="default">Passed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Backup</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>Monitor user access and activity across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {log.device === 'Desktop' && <Monitor className="w-5 h-5 text-primary" />}
                        {log.device === 'Mobile' && <Smartphone className="w-5 h-5 text-primary" />}
                        {log.device === 'Tablet' && <Smartphone className="w-5 h-5 text-primary" />}
                        {log.device === 'Unknown' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{log.user}</h4>
                          <Badge variant="outline">{log.action}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.resource}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>IP: {log.ip}</span>
                          <span>Device: {log.device}</span>
                          <span>Location: {log.location}</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {log.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {log.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerabilities Tab */}
        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Vulnerabilities</CardTitle>
              <CardDescription>Track and manage security vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vulnerabilities.map((vuln) => (
                  <div key={vuln.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        vuln.severity === 'high' ? 'bg-red-100 text-red-600' :
                        vuln.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{vuln.title}</h4>
                          <Badge variant={
                            vuln.severity === 'high' ? 'destructive' :
                            vuln.severity === 'medium' ? 'secondary' : 'outline'
                          }>
                            {vuln.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{vuln.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Component: {vuln.component}</span>
                          <span>Assignee: {vuln.assignee}</span>
                          <span>Due: {vuln.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        vuln.status === 'resolved' ? 'default' :
                        vuln.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {vuln.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {vuln.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                        {vuln.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
  