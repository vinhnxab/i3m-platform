import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { useAnalytics } from '@/features/analytics';
import {
  AnalyticsHeader,
  KPICards,
  CustomerMetrics,
  PlatformMetrics,
  RegionalData,
  PerformanceMetrics,
  ConversionFunnel
} from '@/features/analytics';
import { useState } from 'react';

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    kpiStats,
    customerMetrics,
    platformMetrics,
    regionalData,
    performanceMetrics,
    conversionFunnel,
    isLoading,
    error,
    handleFilter,
    handleExport,
    handleRefresh
  } = useAnalytics();

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      {/* Header */}
      <AnalyticsHeader
        onFilter={handleFilter}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon className={`w-3 h-3 mr-1 ${stat.trend === 'up' ? 'text-chart-2' : 'text-chart-4'}`} />
                  <span className={stat.trend === 'up' ? 'text-chart-2' : 'text-chart-4'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from visitor to customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <div className="text-right">
                          <span className="font-medium">{stage.count.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground ml-2">({stage.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue distribution by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Subscription Revenue', amount: '$845K', percentage: 68, color: 'bg-blue-500' },
                    { source: 'Template Marketplace', amount: '$234K', percentage: 19, color: 'bg-green-500' },
                    { source: 'Professional Services', amount: '$123K', percentage: 10, color: 'bg-purple-500' },
                    { source: 'Support & Training', amount: '$43K', percentage: 3, color: 'bg-orange-500' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.source}</span>
                        <span className="font-medium">{item.amount}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-300`} 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-medium">23.4K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Session Duration</span>
                    <span className="font-medium">24m 32s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pages per Session</span>
                    <span className="font-medium">4.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bounce Rate</span>
                    <Badge variant="outline">12.3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">MRR Growth</span>
                    <Badge variant="default" className="text-green-600">+18%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Growth</span>
                    <Badge variant="default" className="text-green-600">+23%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Churn Rate</span>
                    <Badge variant="outline">2.1%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">LTV/CAC Ratio</span>
                    <Badge variant="default">4.2:1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">System Uptime</span>
                    <Badge variant="default">99.9%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="font-medium">142ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Error Rate</span>
                    <Badge variant="outline">0.08%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Security Score</span>
                    <Badge variant="default">A+</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
              <CardDescription>Analysis by customer segment and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {customerMetrics.map((segment, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{segment.segment}</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">{segment.customers} customers</span>
                        <span className="font-medium">{segment.revenue}</span>
                        <Badge variant="outline" className="text-green-600">{segment.growth}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customers: </span>
                        <span className="font-medium">{segment.customers.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium">{segment.revenue}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retention: </span>
                        <Badge variant="outline">{segment.retention}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(index + 1) * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifecycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Trial Users', count: 1247, conversion: '68%' },
                    { stage: 'New Customers', count: 847, conversion: '89%' },
                    { stage: 'Active Customers', count: 5234, conversion: '94%' },
                    { stage: 'Enterprise Customers', count: 423, conversion: '97%' },
                  ].map((stage, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{stage.count.toLocaleString()}</span>
                        <Badge variant="outline">{stage.conversion}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Churn Rate</span>
                    <Badge variant="outline">2.1%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Annual Churn Rate</span>
                    <Badge variant="outline">25.2%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average LTV</span>
                    <span className="font-medium">$4,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Churn Prevention</span>
                    <Badge variant="default">78% success</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platform Analytics Tab */}
        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Module Usage</CardTitle>
              <CardDescription>Usage analytics for each platform module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platformMetrics.map((module, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{module.module}</h4>
                      <Badge variant="outline">{module.engagement} engagement</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Active Users: </span>
                        <span className="font-medium">{module.users.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sessions: </span>
                        <span className="font-medium">{module.sessions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration: </span>
                        <span className="font-medium">{module.avgDuration}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${parseInt(module.engagement)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Analytics Tab */}
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Geographic distribution and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {regionalData.map((region, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium">{region.region}</h4>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Share: {region.share}</span>
                        <Badge variant="outline" className="text-green-600">{region.growth}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Users: </span>
                        <span className="font-medium">{region.users.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium">{region.revenue}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${parseInt(region.share)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Technical performance and reliability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metric.metric}</h4>
                      <p className="text-sm text-muted-foreground">Target: {metric.target}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{metric.value}</span>
                      <Badge variant={
                        metric.status === 'excellent' ? 'default' :
                        metric.status === 'good' ? 'secondary' : 'destructive'
                      }>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="font-medium">74%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '74%' }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Requests/min</span>
                    <span className="font-medium">12,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="default">99.92%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">P95 Response Time</span>
                    <span className="font-medium">245ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rate Limit Hits</span>
                    <Badge variant="outline">0.03%</Badge>
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