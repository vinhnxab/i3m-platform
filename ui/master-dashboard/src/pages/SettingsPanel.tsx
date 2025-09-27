import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Switch, Input, Label } from '@/shared/components/ui';
import { 
  Settings, 
  Shield, 
  Database, 
  Globe,
  Mail,
  Palette,
  Users,
  Key,
  Server,
  Bell,
  Lock,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('general');
  
  // State for editable form fields
  const [formData, setFormData] = useState({
    platformName: 'I3M Platform',
    timezone: 'UTC',
    language: 'English',
    sessionTimeout: 24,
    notificationEmail: 'admin@i3m.com',
    slackChannel: '#alerts',
    teamsChannel: 'Operations Team',
    maxCustomersPerRegion: 10000,
    maxDatabaseSize: 1000,
    maxApiRequests: 1000,
    maxFileUpload: 100
  });

  const [features, setFeatures] = useState({
    erp: true,
    cms: true,
    ecommerce: true,
    support: true,
    marketplace: true,
    analytics: true
  });

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const [monitoringSettings, setMonitoringSettings] = useState({
    apmEnabled: true,
    errorTracking: true,
    metricsCollection: true
  });

  const handleMonitoringToggle = (setting: string, enabled: boolean) => {
    setMonitoringSettings(prev => ({
      ...prev,
      [setting]: enabled
    }));
  };

  const handleSecurityToggle = (category: string, setting: string, enabled: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: enabled
      }
    }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const handleNotificationToggle = (category: 'system' | 'business' | 'technical', setting: string, enabled: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: enabled
      }
    }));
  };

  const systemSettings = {
    platform: {
      name: formData.platformName,
      version: '2024.1.0',
      environment: 'Production',
      region: 'Global',
      timezone: formData.timezone,
      language: formData.language
    },
    features: features,
    maintenance: {
      mode: maintenanceMode,
      scheduled: null,
      lastUpdate: '2024-01-10 02:00 UTC'
    }
  };

  const [securitySettings, setSecuritySettings] = useState({
    authentication: {
      twoFactor: true,
      ssoEnabled: true,
      passwordPolicy: 'Strong',
      sessionTimeout: formData.sessionTimeout
    },
    encryption: {
      dataAtRest: 'AES-256',
      dataInTransit: 'TLS 1.3',
      keyRotation: 'Automatic'
    },
    compliance: {
      gdpr: true,
      hipaa: false,
      sox: true,
      iso27001: true
    }
  });

  const databaseConfig = {
    customerDatabases: 2847,
    sharedDatabase: 1,
    totalStorage: '2.4 TB',
    backupFrequency: 'Daily',
    retentionPeriod: '90 days',
    replicationEnabled: true
  };

  const integrationSettings = [
    { name: 'Stripe Payment Gateway', status: 'connected', config: 'Live Keys' },
    { name: 'PayPal Business', status: 'connected', config: 'Production' },
    { name: 'AWS S3 Storage', status: 'connected', config: 'Multi-Region' },
    { name: 'SendGrid Email', status: 'connected', config: 'Pro Plan' },
    { name: 'Slack Notifications', status: 'disconnected', config: 'Not Configured' },
    { name: 'Microsoft Teams', status: 'connected', config: 'Enterprise' },
  ];

  const [notificationSettings, setNotificationSettings] = useState({
    system: {
      systemAlerts: true,
      maintenanceNotices: true,
      securityAlerts: true,
      performanceAlerts: false
    },
    business: {
      newCustomers: true,
      largeOrders: true,
      supportTickets: true,
      templateSales: false
    },
    technical: {
      errorAlerts: true,
      backupStatus: true,
      deploymentStatus: true,
      apiLimits: false
    }
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Platform Settings</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Configure system settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            All Systems Operational
          </Badge>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>Basic platform configuration and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input 
                    id="platform-name" 
                    value={formData.platformName}
                    onChange={(e) => handleInputChange('platformName', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Badge variant="outline">{systemSettings.platform.version}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Badge variant="default">{systemSettings.platform.environment}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input 
                    id="timezone" 
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Input 
                    id="language" 
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Modules</CardTitle>
                <CardDescription>Enable or disable platform modules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemSettings.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium capitalize">{feature.replace(/([A-Z])/g, ' $1')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {feature === 'erp' && 'Enterprise Resource Planning module'}
                        {feature === 'cms' && 'Content Management System'}
                        {feature === 'ecommerce' && 'E-commerce platform'}
                        {feature === 'support' && 'Customer support system'}
                        {feature === 'marketplace' && 'Template marketplace'}
                        {feature === 'analytics' && 'Analytics and reporting'}
                      </p>
                    </div>
                    <Switch 
                      checked={enabled} 
                      onCheckedChange={(checked) => handleFeatureToggle(feature, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Control platform availability and maintenance windows</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to temporarily disable platform access for maintenance
                    </p>
                  </div>
                  <Switch 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <Badge variant={systemSettings.maintenance.mode ? 'destructive' : 'default'}>
                      {systemSettings.maintenance.mode ? 'Maintenance Active' : 'Operational'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Scheduled Maintenance</Label>
                    <Badge variant="outline">
                      {systemSettings.maintenance.scheduled || 'None Scheduled'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Update</Label>
                    <p className="text-sm text-muted-foreground">{systemSettings.maintenance.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>User authentication and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch 
                    checked={securitySettings.authentication.twoFactor}
                    onCheckedChange={(checked) => handleSecurityToggle('authentication', 'twoFactor', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Single Sign-On (SSO)</Label>
                    <p className="text-sm text-muted-foreground">Enable SSO integration</p>
                  </div>
                  <Switch 
                    checked={securitySettings.authentication.ssoEnabled}
                    onCheckedChange={(checked) => handleSecurityToggle('authentication', 'ssoEnabled', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Badge variant="default">{securitySettings.authentication.passwordPolicy}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (hours)</Label>
                  <Input 
                    type="number" 
                    value={formData.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Encryption</CardTitle>
                <CardDescription>Data encryption and security protocols</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data at Rest</Label>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <Badge variant="default">{securitySettings.encryption.dataAtRest}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data in Transit</Label>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <Badge variant="default">{securitySettings.encryption.dataInTransit}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Key Rotation</Label>
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-green-500" />
                    <Badge variant="default">{securitySettings.encryption.keyRotation}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Standards</CardTitle>
              <CardDescription>Industry compliance and regulatory requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(securitySettings.compliance).map(([standard, enabled]) => (
                  <div key={standard} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {enabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <Label className="uppercase font-medium">{standard}</Label>
                    </div>
                    <Badge variant={enabled ? 'default' : 'outline'}>
                      {enabled ? 'Compliant' : 'Not Configured'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings Tab */}
        <TabsContent value="database" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Overview</CardTitle>
                <CardDescription>Multi-tenant database configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Databases</Label>
                    <p className="text-2xl font-bold">{databaseConfig.customerDatabases.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Shared Database</Label>
                    <p className="text-2xl font-bold">{databaseConfig.sharedDatabase}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Storage Used</Label>
                  <p className="font-medium">{databaseConfig.totalStorage}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Replication</Label>
                    <p className="text-sm text-muted-foreground">Multi-region data replication</p>
                  </div>
                  <Badge variant={databaseConfig.replicationEnabled ? 'default' : 'outline'}>
                    {databaseConfig.replicationEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Database backup and recovery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Badge variant="default">{databaseConfig.backupFrequency}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Retention Period</Label>
                  <Badge variant="outline">{databaseConfig.retentionPeriod}</Badge>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Manual Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Database Performance</CardTitle>
              <CardDescription>Real-time database performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Average Query Time</Label>
                  <p className="text-lg font-medium">89ms</p>
                  <Badge variant="default">Excellent</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Connection Pool</Label>
                  <p className="text-lg font-medium">78%</p>
                  <Badge variant="secondary">Normal</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Cache Hit Rate</Label>
                  <p className="text-lg font-medium">94%</p>
                  <Badge variant="default">Excellent</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Storage Growth</Label>
                  <p className="text-lg font-medium">2.1%</p>
                  <Badge variant="outline">Weekly</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Manage external service integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationSettings.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <Globe className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.config}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={integration.status === 'connected' ? 'default' : 'outline'}>
                        {integration.status === 'connected' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {integration.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
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
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>API keys and webhook settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Rate Limiting</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">1000 req/min</Badge>
                    <Badge variant="outline">Per customer</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Webhook Endpoints</Label>
                  <p className="text-sm text-muted-foreground">12 active webhooks configured</p>
                </div>
                <div className="space-y-2">
                  <Label>API Version</Label>
                  <Badge variant="default">v2024.1</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Manage API Keys
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Health</CardTitle>
                <CardDescription>External service status monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { service: 'Payment Gateway', status: 'operational', uptime: '99.9%' },
                    { service: 'Email Service', status: 'operational', uptime: '99.7%' },
                    { service: 'Storage Service', status: 'operational', uptime: '99.8%' },
                    { service: 'CDN Network', status: 'degraded', uptime: '98.5%' },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{service.service}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{service.uptime}</span>
                        <Badge variant={service.status === 'operational' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Platform and infrastructure alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notificationSettings.system).map(([setting, enabled]) => (
                  <div key={setting} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {setting.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Switch 
                      checked={enabled} 
                      onCheckedChange={(checked) => handleNotificationToggle('system', setting, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Notifications</CardTitle>
                <CardDescription>Customer and revenue alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notificationSettings.business).map(([setting, enabled]) => (
                  <div key={setting} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {setting.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Switch 
                      checked={enabled} 
                      onCheckedChange={(checked) => handleNotificationToggle('business', setting, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Notifications</CardTitle>
                <CardDescription>Development and deployment alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notificationSettings.technical).map(([setting, enabled]) => (
                  <div key={setting} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {setting.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Switch 
                      checked={enabled} 
                      onCheckedChange={(checked) => handleNotificationToggle('technical', setting, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Configure how notifications are delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <Label>Email Notifications</Label>
                  </div>
                  <div className="space-y-2">
                    <Input 
                      placeholder="admin@i3m.com"
                      value={formData.notificationEmail}
                      onChange={(e) => handleInputChange('notificationEmail', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground font-medium">Primary notification email</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <Label>Slack Integration</Label>
                  </div>
                  <div className="space-y-2">
                    <Input 
                      placeholder="#alerts"
                      value={formData.slackChannel}
                      onChange={(e) => handleInputChange('slackChannel', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground font-medium">Slack channel for alerts</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <Label>Teams Integration</Label>
                  </div>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Operations Team"
                      value={formData.teamsChannel}
                      onChange={(e) => handleInputChange('teamsChannel', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground font-medium">Teams channel name</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Advanced platform configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Cache Configuration</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Redis Cache</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CDN Cache</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Application Cache</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Performance Monitoring</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">APM Enabled</span>
                        <Switch 
                          checked={monitoringSettings.apmEnabled}
                          onCheckedChange={(checked) => handleMonitoringToggle('apmEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Tracking</span>
                        <Switch 
                          checked={monitoringSettings.errorTracking}
                          onCheckedChange={(checked) => handleMonitoringToggle('errorTracking', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Metrics Collection</span>
                        <Switch 
                          checked={monitoringSettings.metricsCollection}
                          onCheckedChange={(checked) => handleMonitoringToggle('metricsCollection', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Settings</CardTitle>
                <CardDescription>CI/CD and deployment configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deployment Strategy</Label>
                  <Badge variant="default">Blue-Green</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Auto-scaling</Label>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Health Checks</Label>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Rollback Strategy</Label>
                  <Badge variant="outline">Automatic</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Limits</CardTitle>
                <CardDescription>Platform resource allocation and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Customers per Region</Label>
                  <Input 
                    type="number" 
                    value={formData.maxCustomersPerRegion}
                    onChange={(e) => handleInputChange('maxCustomersPerRegion', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Database Size (GB)</Label>
                  <Input 
                    type="number" 
                    value={formData.maxDatabaseSize}
                    onChange={(e) => handleInputChange('maxDatabaseSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max API Requests/min</Label>
                  <Input 
                    type="number" 
                    value={formData.maxApiRequests}
                    onChange={(e) => handleInputChange('maxApiRequests', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max File Upload Size (MB)</Label>
                  <Input 
                    type="number" 
                    value={formData.maxFileUpload}
                    onChange={(e) => handleInputChange('maxFileUpload', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Actions</CardTitle>
              <CardDescription>Critical system operations and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear All Caches
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export System Logs
                </Button>
                <Button variant="outline" className="w-full">
                  <Server className="w-4 h-4 mr-2" />
                  Restart Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}