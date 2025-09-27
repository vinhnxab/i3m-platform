import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress } from '@/shared/components/ui';
import { 
  Globe, 
  Key, 
  Activity, 
  BarChart3,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Code,
  Terminal,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Copy,
  Webhook,
  BookOpen
} from 'lucide-react';

export function APIManagement() {
  const [activeTab, setActiveTab] = useState('overview');

  const apiStats = [
    { title: 'Total API Calls', value: '2.4M', change: '+18%', icon: Activity, color: 'text-blue-500' },
    { title: 'Active API Keys', value: '1,247', change: '+23', icon: Key, color: 'text-green-500' },
    { title: 'Average Latency', value: '142ms', change: '-15ms', icon: Zap, color: 'text-purple-500' },
    { title: 'Error Rate', value: '0.08%', change: '-0.02%', icon: AlertTriangle, color: 'text-orange-500' },
  ];

  const apiEndpoints = [
    {
      id: 1,
      path: '/api/v1/customers',
      method: 'GET',
      service: 'Customer Service',
      description: 'Retrieve customer information',
      calls24h: 45230,
      avgLatency: '89ms',
      errorRate: '0.02%',
      status: 'healthy',
      rateLimit: '1000/min',
      auth: 'API Key + JWT'
    },
    {
      id: 2,
      path: '/api/v1/orders',
      method: 'POST',
      service: 'E-commerce Service',
      description: 'Create new orders',
      calls24h: 23450,
      avgLatency: '156ms',
      errorRate: '0.05%',
      status: 'healthy',
      rateLimit: '500/min',
      auth: 'API Key + JWT'
    },
    {
      id: 3,
      path: '/api/v1/payments',
      method: 'POST',
      service: 'Payment Service',
      description: 'Process payments',
      calls24h: 12340,
      avgLatency: '234ms',
      errorRate: '0.12%',
      status: 'warning',
      rateLimit: '100/min',
      auth: 'API Key + OAuth'
    },
    {
      id: 4,
      path: '/api/v1/analytics',
      method: 'GET',
      service: 'Analytics Service',
      description: 'Fetch analytics data',
      calls24h: 67890,
      avgLatency: '312ms',
      errorRate: '0.03%',
      status: 'healthy',
      rateLimit: '2000/min',
      auth: 'API Key'
    },
    {
      id: 5,
      path: '/api/v1/support/tickets',
      method: 'GET',
      service: 'Support Service',
      description: 'Retrieve support tickets',
      calls24h: 8970,
      avgLatency: '123ms',
      errorRate: '0.08%',
      status: 'healthy',
      rateLimit: '1500/min',
      auth: 'API Key + JWT'
    },
    {
      id: 6,
      path: '/api/v1/templates',
      method: 'GET',
      service: 'Template Service',
      description: 'Browse template marketplace',
      calls24h: 34567,
      avgLatency: '78ms',
      errorRate: '0.01%',
      status: 'healthy',
      rateLimit: '3000/min',
      auth: 'API Key'
    }
  ];

  const apiKeys = [
    {
      id: 1,
      name: 'Production API Key',
      key: 'ak_live_1234567890abcdef',
      customer: 'TechCorp Inc.',
      environment: 'production',
      permissions: ['read:customers', 'write:orders', 'read:analytics'],
      rateLimit: '10000/hour',
      lastUsed: '2024-01-15 14:30:00',
      calls30d: 892456,
      status: 'active'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'ak_test_abcdef1234567890',
      customer: 'StartupCo',
      environment: 'development',
      permissions: ['read:customers', 'read:orders'],
      rateLimit: '1000/hour',
      lastUsed: '2024-01-15 13:45:00',
      calls30d: 45623,
      status: 'active'
    },
    {
      id: 3,
      name: 'Mobile App API Key',
      key: 'ak_live_fedcba0987654321',
      customer: 'Global Solutions',
      environment: 'production',
      permissions: ['read:customers', 'write:orders', 'read:support'],
      rateLimit: '5000/hour',
      lastUsed: '2024-01-15 12:20:00',
      calls30d: 234567,
      status: 'active'
    },
    {
      id: 4,
      name: 'Integration API Key',
      key: 'ak_live_567890abcdef1234',
      customer: 'Enterprise Ltd',
      environment: 'production',
      permissions: ['read:*', 'write:*'],
      rateLimit: '50000/hour',
      lastUsed: '2024-01-15 11:15:00',
      calls30d: 1456789,
      status: 'active'
    },
    {
      id: 5,
      name: 'Backup API Key',
      key: 'ak_test_backup123456789',
      customer: 'TechCorp Inc.',
      environment: 'staging',
      permissions: ['read:customers'],
      rateLimit: '100/hour',
      lastUsed: '2024-01-10 09:30:00',
      calls30d: 1234,
      status: 'inactive'
    }
  ];

  const webhooks = [
    {
      id: 1,
      name: 'Order Status Updates',
      url: 'https://api.techcorp.com/webhooks/orders',
      events: ['order.created', 'order.updated', 'order.completed'],
      customer: 'TechCorp Inc.',
      status: 'active',
      lastTriggered: '2024-01-15 14:25:00',
      successRate: 98.7,
      retryPolicy: 'exponential'
    },
    {
      id: 2,
      name: 'Payment Notifications',
      url: 'https://hooks.startupco.com/payments',
      events: ['payment.success', 'payment.failed'],
      customer: 'StartupCo',
      status: 'active',
      lastTriggered: '2024-01-15 13:20:00',
      successRate: 99.2,
      retryPolicy: 'linear'
    },
    {
      id: 3,
      name: 'Support Ticket Updates',
      url: 'https://api.globalsolutions.com/support',
      events: ['ticket.created', 'ticket.resolved'],
      customer: 'Global Solutions',
      status: 'failing',
      lastTriggered: '2024-01-15 12:10:00',
      successRate: 76.3,
      retryPolicy: 'exponential'
    },
    {
      id: 4,
      name: 'User Activity Events',
      url: 'https://analytics.enterprise.com/events',
      events: ['user.login', 'user.logout', 'user.action'],
      customer: 'Enterprise Ltd',
      status: 'active',
      lastTriggered: '2024-01-15 14:30:00',
      successRate: 94.8,
      retryPolicy: 'exponential'
    }
  ];

  const rateLimits = [
    {
      customer: 'TechCorp Inc.',
      plan: 'Enterprise',
      hourlyLimit: 100000,
      currentUsage: 67834,
      dailyLimit: 2000000,
      dailyUsage: 1234567,
      status: 'healthy'
    },
    {
      customer: 'StartupCo',
      plan: 'Professional',
      hourlyLimit: 10000,
      currentUsage: 8945,
      dailyLimit: 200000,
      dailyUsage: 156789,
      status: 'warning'
    },
    {
      customer: 'Global Solutions',
      plan: 'Business',
      hourlyLimit: 50000,
      currentUsage: 23456,
      dailyLimit: 1000000,
      dailyUsage: 567890,
      status: 'healthy'
    },
    {
      customer: 'Enterprise Ltd',
      plan: 'Enterprise Plus',
      hourlyLimit: 500000,
      currentUsage: 234567,
      dailyLimit: 10000000,
      dailyUsage: 4567890,
      status: 'healthy'
    }
  ];

  const apiMetrics = [
    { time: '00:00', requests: 8200, latency: 145, errors: 12 },
    { time: '04:00', requests: 6400, latency: 123, errors: 8 },
    { time: '08:00', requests: 12800, latency: 156, errors: 23 },
    { time: '12:00', requests: 18400, latency: 189, errors: 34 },
    { time: '16:00', requests: 15600, latency: 167, errors: 28 },
    { time: '20:00', requests: 11200, latency: 134, errors: 15 },
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">API Management</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Comprehensive API gateway and developer portal</p>
        </div>
        <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            All Systems Operational
          </Badge>
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            API Docs
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Generate API Key
          </Button>
        </div>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {apiStats.map((stat, index) => {
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
                  </span> from last 24h
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* API Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Health */}
            <Card>
              <CardHeader>
                <CardTitle>API Health Overview</CardTitle>
                <CardDescription>Real-time API performance and health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Health Score</span>
                    <Badge variant="default">96.8%</Badge>
                  </div>
                  <Progress value={96.8} className="h-2" />
                  
                  <div className="space-y-3">
                    {[
                      { service: 'Customer Service API', health: 98, color: 'bg-green-500' },
                      { service: 'E-commerce API', health: 95, color: 'bg-green-500' },
                      { service: 'Payment API', health: 87, color: 'bg-yellow-500' },
                      { service: 'Support API', health: 99, color: 'bg-green-500' },
                      { service: 'Analytics API', health: 92, color: 'bg-green-500' },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.service}</span>
                          <span>{item.health}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full`} 
                            style={{ width: `${item.health}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate Limit Status */}
            <Card>
              <CardHeader>
                <CardTitle>Rate Limit Status</CardTitle>
                <CardDescription>Current API usage and rate limiting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rateLimits.slice(0, 4).map((limit, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{limit.customer}</span>
                        <Badge variant="outline">{limit.plan}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Hourly: {limit.currentUsage.toLocaleString()}/{limit.hourlyLimit.toLocaleString()}</span>
                          <span>{Math.round((limit.currentUsage / limit.hourlyLimit) * 100)}%</span>
                        </div>
                        <Progress value={(limit.currentUsage / limit.hourlyLimit) * 100} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Metrics Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>24-Hour API Metrics</CardTitle>
              <CardDescription>Request volume, latency, and error rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Request Volume</h4>
                  {apiMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(metric.requests / 20000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{(metric.requests / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Average Latency</h4>
                  {apiMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(metric.latency / 300) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{metric.latency}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Error Count</h4>
                  {apiMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(metric.errors / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{metric.errors}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Monitor and manage API endpoints across services</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint) => (
                  <div key={endpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Code className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            endpoint.method === 'GET' ? 'default' :
                            endpoint.method === 'POST' ? 'secondary' :
                            endpoint.method === 'PUT' ? 'outline' : 'destructive'
                          }>
                            {endpoint.method}
                          </Badge>
                          <code className="font-mono text-sm">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Service: {endpoint.service}</span>
                          <span>Calls: {endpoint.calls24h.toLocaleString()}/24h</span>
                          <span>Latency: {endpoint.avgLatency}</span>
                          <span>Error: {endpoint.errorRate}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Rate Limit: {endpoint.rateLimit}</span>
                          <span>Auth: {endpoint.auth}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        endpoint.status === 'healthy' ? 'default' :
                        endpoint.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {endpoint.status === 'healthy' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {endpoint.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {endpoint.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Key Management</CardTitle>
                  <CardDescription>Manage API keys and access permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge variant="outline">{apiKey.environment}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 font-mono text-sm">
                          <span>{apiKey.key.substring(0, 20)}...</span>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Customer: {apiKey.customer}</span>
                          <span>Rate Limit: {apiKey.rateLimit}</span>
                          <span>Calls: {apiKey.calls30d.toLocaleString()}/30d</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>Last used: {apiKey.lastUsed}</span>
                          <span>Permissions: {apiKey.permissions.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                        {apiKey.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhook Management</CardTitle>
                  <CardDescription>Manage webhook endpoints and event subscriptions</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        webhook.status === 'active' ? 'bg-green-100 text-green-600' :
                        webhook.status === 'failing' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Webhook className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{webhook.name}</h4>
                        <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Customer: {webhook.customer}</span>
                          <span>Success Rate: {webhook.successRate}%</span>
                          <span>Retry: {webhook.retryPolicy}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>Events: {webhook.events.join(', ')}</span>
                          <span>Last triggered: {webhook.lastTriggered}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={
                          webhook.status === 'active' ? 'default' :
                          webhook.status === 'failing' ? 'destructive' : 'secondary'
                        }>
                          {webhook.status}
                        </Badge>
                        <div className="mt-1">
                          <Progress value={webhook.successRate} className="h-1 w-16" />
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Usage Analytics</CardTitle>
                <CardDescription>Detailed API usage patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Requests (30d)</span>
                    <span className="font-medium">72.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Unique API Keys</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Requests/min</span>
                    <span className="font-medium">45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Transferred</span>
                    <span className="font-medium">2.4 TB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top API Consumers</CardTitle>
                <CardDescription>Customers with highest API usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { customer: 'Enterprise Ltd', calls: 1456789, percentage: 45 },
                    { customer: 'TechCorp Inc.', calls: 892456, percentage: 27 },
                    { customer: 'Global Solutions', calls: 456789, percentage: 14 },
                    { customer: 'StartupCo', calls: 234567, percentage: 8 },
                    { customer: 'Others', calls: 189432, percentage: 6 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.customer}</span>
                        <span>{item.calls.toLocaleString()} calls</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
              <CardDescription>API error patterns and resolution status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Error Distribution</h4>
                  {[
                    { code: '400 Bad Request', count: 234, color: 'bg-yellow-500' },
                    { code: '401 Unauthorized', count: 156, color: 'bg-red-500' },
                    { code: '429 Rate Limited', count: 89, color: 'bg-orange-500' },
                    { code: '500 Server Error', count: 45, color: 'bg-red-600' },
                  ].map((error, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${error.color}`} />
                        <span className="text-sm">{error.code}</span>
                      </div>
                      <Badge variant="outline">{error.count}</Badge>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Resolution Time</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average</span>
                      <span>4.2 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>P95</span>
                      <span>12.8 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>P99</span>
                      <span>28.3 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Error Trends</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Today</span>
                      <Badge variant="outline">524 errors</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Yesterday</span>
                      <Badge variant="outline">678 errors</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Week</span>
                      <Badge variant="outline">3,456 errors</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );}