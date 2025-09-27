import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress } from '@/shared/components/ui';
import { 
  Database, 
  HardDrive, 
  Cloud,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  Calendar,
  Settings,
  Archive,
  Server,
  History,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function BackupManagement() {
  const [activeTab, setActiveTab] = useState('overview');

  const backupStats = [
    { title: 'Total Backups', value: '2,847', change: '+24', icon: Database, color: 'text-blue-500' },
    { title: 'Storage Used', value: '4.2 TB', change: '+120 GB', icon: HardDrive, color: 'text-green-500' },
    { title: 'Success Rate', value: '99.8%', change: '+0.2%', icon: CheckCircle, color: 'text-purple-500' },
    { title: 'Recovery Time', value: '4.2min', change: '-0.8min', icon: RotateCcw, color: 'text-orange-500' },
  ];

  const backupJobs = [
    {
      id: 1,
      name: 'Customer Database Daily',
      type: 'Database',
      database: 'customer_production',
      schedule: 'Daily at 02:00 UTC',
      lastRun: '2024-01-15 02:00:00',
      nextRun: '2024-01-16 02:00:00',
      status: 'completed',
      size: '2.4 GB',
      duration: '3m 45s',
      retention: '90 days'
    },
    {
      id: 2,
      name: 'Shared Database Backup',
      type: 'Database',
      database: 'shared_platform',
      schedule: 'Every 6 hours',
      lastRun: '2024-01-15 12:00:00',
      nextRun: '2024-01-15 18:00:00',
      status: 'completed',
      size: '890 MB',
      duration: '1m 23s',
      retention: '30 days'
    },
    {
      id: 3,
      name: 'File Storage Backup',
      type: 'Files',
      database: 'media_storage',
      schedule: 'Daily at 03:00 UTC',
      lastRun: '2024-01-15 03:00:00',
      nextRun: '2024-01-16 03:00:00',
      status: 'running',
      size: '567 GB',
      duration: '45m 12s',
      retention: '180 days'
    },
    {
      id: 4,
      name: 'Analytics Database',
      type: 'Database',
      database: 'analytics_warehouse',
      schedule: 'Weekly on Sunday',
      lastRun: '2024-01-14 01:00:00',
      nextRun: '2024-01-21 01:00:00',
      status: 'completed',
      size: '12.3 GB',
      duration: '8m 56s',
      retention: '365 days'
    },
    {
      id: 5,
      name: 'Configuration Backup',
      type: 'System',
      database: 'system_config',
      schedule: 'Daily at 01:00 UTC',
      lastRun: '2024-01-15 01:00:00',
      nextRun: '2024-01-16 01:00:00',
      status: 'failed',
      size: '45 MB',
      duration: '30s',
      retention: '60 days'
    },
    {
      id: 6,
      name: 'Transaction Logs',
      type: 'Logs',
      database: 'transaction_logs',
      schedule: 'Hourly',
      lastRun: '2024-01-15 14:00:00',
      nextRun: '2024-01-15 15:00:00',
      status: 'completed',
      size: '234 MB',
      duration: '45s',
      retention: '7 days'
    }
  ];

  const storageMetrics = [
    {
      location: 'Primary (AWS S3)',
      used: '2.4 TB',
      total: '5.0 TB',
      usage: 48,
      region: 'us-east-1',
      cost: '$67.20/month',
      encryption: 'AES-256'
    },
    {
      location: 'Secondary (Google Cloud)',
      used: '1.8 TB',
      total: '3.0 TB',
      usage: 60,
      region: 'us-central1',
      cost: '$54.30/month',
      encryption: 'AES-256'
    },
    {
      location: 'Archive (Glacier)',
      used: '15.6 TB',
      total: '50.0 TB',
      usage: 31,
      region: 'multiple',
      cost: '$23.40/month',
      encryption: 'AES-256'
    }
  ];

  const recoveryScenarios = [
    {
      id: 1,
      name: 'Point-in-Time Recovery',
      description: 'Restore database to specific timestamp',
      rto: '< 15 minutes',
      rpo: '< 5 minutes',
      lastTested: '2024-01-10',
      status: 'verified'
    },
    {
      id: 2,
      name: 'Full System Recovery',
      description: 'Complete system restoration from backup',
      rto: '< 2 hours',
      rpo: '< 1 hour',
      lastTested: '2024-01-05',
      status: 'verified'
    },
    {
      id: 3,
      name: 'Cross-Region Failover',
      description: 'Failover to secondary region',
      rto: '< 30 minutes',
      rpo: '< 15 minutes',
      lastTested: '2023-12-15',
      status: 'due'
    },
    {
      id: 4,
      name: 'Selective Data Recovery',
      description: 'Restore specific tables or files',
      rto: '< 10 minutes',
      rpo: '< 5 minutes',
      lastTested: '2024-01-12',
      status: 'verified'
    }
  ];

  const backupHistory = [
    {
      id: 1,
      timestamp: '2024-01-15 14:00:00',
      job: 'Customer Database Daily',
      status: 'completed',
      size: '2.4 GB',
      duration: '3m 45s',
      location: 'AWS S3'
    },
    {
      id: 2,
      timestamp: '2024-01-15 12:00:00',
      job: 'Shared Database Backup',
      status: 'completed',
      size: '890 MB',
      duration: '1m 23s',
      location: 'AWS S3'
    },
    {
      id: 3,
      timestamp: '2024-01-15 03:00:00',
      job: 'File Storage Backup',
      status: 'completed',
      size: '567 GB',
      duration: '45m 12s',
      location: 'Google Cloud'
    },
    {
      id: 4,
      timestamp: '2024-01-15 01:00:00',
      job: 'Configuration Backup',
      status: 'failed',
      size: '0 MB',
      duration: '0s',
      location: 'N/A',
      error: 'Connection timeout'
    }
  ];

  const complianceRequirements = [
    { standard: 'GDPR', requirement: '7 years retention', status: 'compliant', backups: 2456 },
    { standard: 'SOX', requirement: '7 years retention', status: 'compliant', backups: 1234 },
    { standard: 'HIPAA', requirement: '6 years retention', status: 'compliant', backups: 567 },
    { standard: 'PCI DSS', requirement: '1 year retention', status: 'compliant', backups: 890 },
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Backup & Recovery</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Comprehensive backup management and disaster recovery</p>
        </div>
        <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            All Systems Operational
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Run Backup
          </Button>
        </div>
      </div>

      {/* Backup Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {backupStats.map((stat, index) => {
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
                  <span className="font-semibold text-chart-2">{stat.change}</span> from last week
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Backup Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Backup Jobs</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup Status */}
            <Card>
              <CardHeader>
                <CardTitle>Backup Status Overview</CardTitle>
                <CardDescription>Current backup health and recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Successful Backups (24h)</span>
                    <Badge variant="default">23/24</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Backups (24h)</span>
                    <Badge variant="destructive">1/24</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Running Backups</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Scheduled</span>
                    <span className="text-sm font-medium">15:00 UTC</span>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Overall Health Score</span>
                      <span>96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Backup Activity</CardTitle>
                <CardDescription>Latest backup operations and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupHistory.slice(0, 4).map((backup) => (
                    <div key={backup.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        backup.status === 'completed' ? 'bg-green-500' :
                        backup.status === 'running' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{backup.job}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {backup.size} • {backup.duration} • {backup.location}
                        </p>
                        {backup.error && (
                          <p className="text-xs text-red-600">{backup.error}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{backup.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Overview</CardTitle>
              <CardDescription>Backup storage utilization across providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {storageMetrics.map((storage, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{storage.location}</h4>
                      <Badge variant="outline">{storage.region}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used</span>
                        <span>{storage.used} / {storage.total}</span>
                      </div>
                      <Progress value={storage.usage} className="h-2" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{storage.cost}</span>
                      <span>{storage.encryption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Jobs</CardTitle>
              <CardDescription>Manage scheduled backup operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        job.type === 'Database' ? 'bg-blue-100 text-blue-600' :
                        job.type === 'Files' ? 'bg-green-100 text-green-600' :
                        job.type === 'System' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {job.type === 'Database' && <Database className="w-5 h-5" />}
                        {job.type === 'Files' && <HardDrive className="w-5 h-5" />}
                        {job.type === 'System' && <Server className="w-5 h-5" />}
                        {job.type === 'Logs' && <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{job.name}</h4>
                          <Badge variant="outline">{job.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.database}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Schedule: {job.schedule}</span>
                          <span>Size: {job.size}</span>
                          <span>Duration: {job.duration}</span>
                          <span>Retention: {job.retention}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Last: {job.lastRun}</span>
                          <span>Next: {job.nextRun}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        job.status === 'completed' ? 'default' :
                        job.status === 'running' ? 'secondary' :
                        job.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {job.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {job.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                        {job.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {job.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>Monitor and manage backup storage across providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {storageMetrics.map((storage, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Cloud className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{storage.location}</h4>
                          <p className="text-sm text-muted-foreground">Region: {storage.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{storage.cost}</p>
                        <p className="text-sm text-muted-foreground">{storage.encryption}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage Used</span>
                        <span>{storage.used} / {storage.total} ({storage.usage}%)</span>
                      </div>
                      <Progress value={storage.usage} className="h-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Used:</span>
                        <span className="ml-2 font-medium">{storage.used}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available:</span>
                        <span className="ml-2 font-medium">{(parseFloat(storage.total) - parseFloat(storage.used)).toFixed(1)} TB</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Usage:</span>
                        <span className="ml-2 font-medium">{storage.usage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Compression Ratio</span>
                    <Badge variant="default">3.2:1</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Deduplication Savings</span>
                    <Badge variant="default">34%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Archive Lifecycle</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Optimization</span>
                    <Badge variant="default">$234 saved/month</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Database Backups', size: '2.8 TB', percentage: 45 },
                    { type: 'File Backups', size: '1.9 TB', percentage: 30 },
                    { type: 'System Backups', size: '0.8 TB', percentage: 13 },
                    { type: 'Log Archives', size: '0.7 TB', percentage: 12 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disaster Recovery Scenarios</CardTitle>
              <CardDescription>Manage and test disaster recovery procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recoveryScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>RTO: {scenario.rto}</span>
                          <span>RPO: {scenario.rpo}</span>
                          <span>Last tested: {scenario.lastTested}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        scenario.status === 'verified' ? 'default' :
                        scenario.status === 'due' ? 'secondary' : 'destructive'
                      }>
                        {scenario.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {scenario.status === 'due' && <Clock className="w-3 h-3 mr-1" />}
                        {scenario.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Test Recovery
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recovery Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Average RTO</span>
                    <span className="font-medium">18.7 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average RPO</span>
                    <span className="font-medium">6.2 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Recovery Success Rate</span>
                    <Badge variant="default">98.5%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Recovery Test</span>
                    <span className="font-medium">2024-01-12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recovery Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Point-in-Time Recovery
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Archive className="w-4 h-4 mr-2" />
                    Full System Restore
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Database Recovery
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    File Recovery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>Ensure backup compliance with regulatory standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {complianceRequirements.map((compliance, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{compliance.standard}</h4>
                        <p className="text-sm text-muted-foreground">{compliance.requirement}</p>
                        <p className="text-sm text-muted-foreground font-medium">{compliance.backups} qualifying backups</p>
                      </div>
                    </div>
                    <Badge variant={compliance.status === 'compliant' ? 'default' : 'destructive'}>
                      {compliance.status === 'compliant' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {compliance.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Backup Events Logged</span>
                    <span className="font-medium">15,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Recovery Events</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Integrity Checks</span>
                    <Badge variant="default">Passed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Compliance Score</span>
                    <Badge variant="default">99.2%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Backups</span>
                    <span className="font-medium">90 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Weekly Backups</span>
                    <span className="font-medium">1 year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Backups</span>
                    <span className="font-medium">7 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Archive Backups</span>
                    <span className="font-medium">25 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}