import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress } from '@/shared/components/ui';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Download,
  Settings,
  Monitor,
  Wifi,
  HardDrive,
  MemoryStick
} from 'lucide-react';

export function PerformanceMonitoring() {
  const [activeTab, setActiveTab] = useState('overview');

  const performanceStats = [
    { title: 'System Uptime', value: '99.97%', change: '+0.05%', icon: CheckCircle, color: 'text-green-500' },
    { title: 'Response Time', value: '142ms', change: '-15ms', icon: Zap, color: 'text-blue-500' },
    { title: 'Throughput', value: '15.2K/s', change: '+8.3%', icon: TrendingUp, color: 'text-purple-500' },
    { title: 'Error Rate', value: '0.08%', change: '-0.02%', icon: AlertTriangle, color: 'text-orange-500' },
  ];

  const systemMetrics = [
    {
      service: 'API Gateway',
      status: 'healthy',
      uptime: '99.98%',
      responseTime: '45ms',
      throughput: '12.5K/s',
      errorRate: '0.02%',
      cpu: 34,
      memory: 67,
      instances: 8
    },
    {
      service: 'Customer Service',
      status: 'healthy',
      uptime: '99.95%',
      responseTime: '89ms',
      throughput: '8.3K/s',
      errorRate: '0.05%',
      cpu: 56,
      memory: 78,
      instances: 6
    },
    {
      service: 'E-commerce Service',
      status: 'warning',
      uptime: '99.87%',
      responseTime: '156ms',
      throughput: '6.7K/s',
      errorRate: '0.12%',
      cpu: 82,
      memory: 89,
      instances: 4
    },
    {
      service: 'Payment Service',
      status: 'healthy',
      uptime: '99.99%',
      responseTime: '67ms',
      throughput: '4.2K/s',
      errorRate: '0.01%',
      cpu: 23,
      memory: 45,
      instances: 5
    },
    {
      service: 'Support Service',
      status: 'healthy',
      uptime: '99.93%',
      responseTime: '123ms',
      throughput: '2.8K/s',
      errorRate: '0.08%',
      cpu: 45,
      memory: 62,
      instances: 3
    },
    {
      service: 'Analytics Service',
      status: 'degraded',
      uptime: '98.75%',
      responseTime: '234ms',
      throughput: '1.9K/s',
      errorRate: '0.25%',
      cpu: 91,
      memory: 94,
      instances: 2
    }
  ];

  const infrastructureMetrics = [
    {
      region: 'US-East-1',
      status: 'healthy',
      latency: '12ms',
      availability: '99.99%',
      load: 68,
      instances: 24,
      traffic: '45%'
    },
    {
      region: 'US-West-2',
      status: 'healthy',
      latency: '18ms',
      availability: '99.97%',
      load: 72,
      instances: 18,
      traffic: '28%'
    },
    {
      region: 'EU-West-1',
      status: 'warning',
      latency: '35ms',
      availability: '99.89%',
      load: 89,
      instances: 15,
      traffic: '22%'
    },
    {
      region: 'AP-Southeast-1',
      status: 'healthy',
      latency: '22ms',
      availability: '99.95%',
      load: 54,
      instances: 12,
      traffic: '15%'
    }
  ];

  const databaseMetrics = [
    {
      database: 'Customer DB Primary',
      status: 'healthy',
      connections: 245,
      maxConnections: 500,
      queryTime: '45ms',
      cpu: 56,
      memory: 67,
      storage: 78
    },
    {
      database: 'Customer DB Replica',
      status: 'healthy',
      connections: 123,
      maxConnections: 300,
      queryTime: '52ms',
      cpu: 34,
      memory: 45,
      storage: 78
    },
    {
      database: 'Shared DB',
      status: 'warning',
      connections: 189,
      maxConnections: 200,
      queryTime: '89ms',
      cpu: 78,
      memory: 82,
      storage: 67
    },
    {
      database: 'Analytics DB',
      status: 'healthy',
      connections: 67,
      maxConnections: 150,
      queryTime: '123ms',
      cpu: 45,
      memory: 56,
      storage: 89
    }
  ];

  const alerts = [
    {
      id: 1,
      severity: 'critical',
      service: 'Analytics Service',
      message: 'High CPU usage detected (>90%)',
      timestamp: '2024-01-15 14:35:00',
      status: 'active'
    },
    {
      id: 2,
      severity: 'warning',
      service: 'E-commerce Service',
      message: 'Response time increased by 45%',
      timestamp: '2024-01-15 14:20:00',
      status: 'investigating'
    },
    {
      id: 3,
      severity: 'info',
      service: 'Payment Service',
      message: 'Auto-scaling triggered - added 2 instances',
      timestamp: '2024-01-15 13:45:00',
      status: 'resolved'
    },
    {
      id: 4,
      severity: 'warning',
      service: 'EU-West-1',
      message: 'High latency detected in region',
      timestamp: '2024-01-15 13:20:00',
      status: 'active'
    }
  ];

  const performanceTrends = [
    { time: '00:00', cpu: 35, memory: 62, requests: 8200 },
    { time: '04:00', cpu: 28, memory: 58, requests: 6400 },
    { time: '08:00', cpu: 45, memory: 68, requests: 12800 },
    { time: '12:00', cpu: 72, memory: 78, requests: 18400 },
    { time: '16:00', cpu: 68, memory: 75, requests: 15600 },
    { time: '20:00', cpu: 52, memory: 70, requests: 11200 },
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Performance Monitoring</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Real-time system performance and infrastructure monitoring</p>
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
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {performanceStats.map((stat, index) => {
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
                  </span> from last hour
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health Overview</CardTitle>
                <CardDescription>Real-time system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>74%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network I/O</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span>52%</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Current performance alerts and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.service}</p>
                        <p className="text-sm text-muted-foreground font-medium">{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={
                            alert.status === 'active' ? 'destructive' :
                            alert.status === 'investigating' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {alert.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Performance Trends</CardTitle>
              <CardDescription>System performance over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">CPU Usage</h4>
                  {performanceTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{trend.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${trend.cpu}%` }}
                          />
                        </div>
                        <span className="text-sm">{trend.cpu}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Memory Usage</h4>
                  {performanceTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{trend.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${trend.memory}%` }}
                          />
                        </div>
                        <span className="text-sm">{trend.memory}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Request Rate</h4>
                  {performanceTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{trend.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${(trend.requests / 20000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{(trend.requests / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Microservices Performance</CardTitle>
              <CardDescription>Monitor individual service performance and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemMetrics.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        service.status === 'healthy' ? 'bg-green-100 text-green-600' :
                        service.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{service.service}</h4>
                          <Badge variant={
                            service.status === 'healthy' ? 'default' :
                            service.status === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Uptime: {service.uptime}</span>
                          <span>Response: {service.responseTime}</span>
                          <span>Throughput: {service.throughput}</span>
                          <span>Error: {service.errorRate}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Instances: {service.instances}</span>
                          <span>CPU: {service.cpu}%</span>
                          <span>Memory: {service.memory}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">CPU</span>
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  service.cpu > 80 ? 'bg-red-500' : 
                                  service.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${service.cpu}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">RAM</span>
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  service.memory > 80 ? 'bg-red-500' : 
                                  service.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${service.memory}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Performance</CardTitle>
              <CardDescription>Monitor regional infrastructure and load balancing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {infrastructureMetrics.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        region.status === 'healthy' ? 'bg-green-100 text-green-600' :
                        region.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{region.region}</h4>
                          <Badge variant={
                            region.status === 'healthy' ? 'default' :
                            region.status === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {region.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Latency: {region.latency}</span>
                          <span>Availability: {region.availability}</span>
                          <span>Instances: {region.instances}</span>
                          <span>Traffic: {region.traffic}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Load</span>
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                region.load > 80 ? 'bg-red-500' : 
                                region.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${region.load}%` }}
                            />
                          </div>
                          <span className="text-xs">{region.load}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Monitor className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Global Latency</span>
                    <span className="font-medium">18ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bandwidth Usage</span>
                    <span className="font-medium">2.4 Gbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CDN Hit Rate</span>
                    <Badge variant="default">94.7%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">SSL Handshake</span>
                    <span className="font-medium">45ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Load Balancing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Instances</span>
                    <span className="font-medium">69</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Auto-scaled Today</span>
                    <Badge variant="outline">12 times</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Load Distribution</span>
                    <Badge variant="default">Balanced</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Health Checks</span>
                    <Badge variant="default">Passing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total CPU Cores</span>
                    <span className="font-medium">276</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Memory</span>
                    <span className="font-medium">1.2 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="font-medium">4.8 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Optimization</span>
                    <Badge variant="default">87%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Databases Tab */}
        <TabsContent value="databases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Performance</CardTitle>
              <CardDescription>Monitor database performance and resource usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {databaseMetrics.map((db, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        db.status === 'healthy' ? 'bg-green-100 text-green-600' :
                        db.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{db.database}</h4>
                          <Badge variant={
                            db.status === 'healthy' ? 'default' :
                            db.status === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {db.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Connections: {db.connections}/{db.maxConnections}</span>
                          <span>Query Time: {db.queryTime}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>CPU: {db.cpu}%</span>
                          <span>Memory: {db.memory}%</span>
                          <span>Storage: {db.storage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-3 h-3" />
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                db.cpu > 80 ? 'bg-red-500' : 
                                db.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${db.cpu}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MemoryStick className="w-3 h-3" />
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                db.memory > 80 ? 'bg-red-500' : 
                                db.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${db.memory}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <HardDrive className="w-3 h-3" />
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                db.storage > 80 ? 'bg-red-500' : 
                                db.storage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${db.storage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <LineChart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>Monitor and manage performance alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{alert.service}</h4>
                          <Badge variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'warning' ? 'secondary' : 'outline'
                          }>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        alert.status === 'active' ? 'destructive' :
                        alert.status === 'investigating' ? 'secondary' : 'default'
                      }>
                        {alert.status === 'active' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {alert.status === 'investigating' && <Clock className="w-3 h-3 mr-1" />}
                        {alert.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {alert.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Investigate
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