import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Download,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui';
import { AnalyticsMetric, ChartData, AnalyticsReport } from '../types';

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data
  const metrics: AnalyticsMetric[] = [
    {
      id: '1',
      name: 'Total Visitors',
      value: 45231,
      change: 12.5,
      changeType: 'increase',
      period: 'vs last week'
    },
    {
      id: '2',
      name: 'Page Views',
      value: 125430,
      change: 8.2,
      changeType: 'increase',
      period: 'vs last week'
    },
    {
      id: '3',
      name: 'Bounce Rate',
      value: 34.2,
      change: -2.1,
      changeType: 'decrease',
      period: 'vs last week'
    },
    {
      id: '4',
      name: 'Avg. Session Duration',
      value: 4.2,
      change: 0.8,
      changeType: 'increase',
      period: 'vs last week'
    }
  ];

  const topPages: ChartData[] = [
    { name: '/dashboard', value: 15420, category: 'Dashboard' },
    { name: '/products', value: 12350, category: 'Products' },
    { name: '/analytics', value: 9870, category: 'Analytics' },
    { name: '/settings', value: 6540, category: 'Settings' },
    { name: '/profile', value: 4320, category: 'Profile' }
  ];

  const trafficSources: ChartData[] = [
    { name: 'Direct', value: 45.2, category: 'Direct' },
    { name: 'Google', value: 28.7, category: 'Search' },
    { name: 'Social Media', value: 15.3, category: 'Social' },
    { name: 'Email', value: 8.1, category: 'Email' },
    { name: 'Referral', value: 2.7, category: 'Referral' }
  ];

  const reports: AnalyticsReport[] = [
    {
      id: '1',
      title: 'Weekly Performance Report',
      description: 'Comprehensive weekly analytics overview',
      type: 'scheduled',
      createdAt: new Date('2024-01-15'),
      lastRun: new Date('2024-01-21'),
      isActive: true
    },
    {
      id: '2',
      title: 'User Engagement Analysis',
      description: 'Deep dive into user behavior patterns',
      type: 'custom',
      createdAt: new Date('2024-01-18'),
      lastRun: new Date('2024-01-20'),
      isActive: true
    },
    {
      id: '3',
      title: 'Traffic Source Report',
      description: 'Analysis of traffic sources and conversion',
      type: 'dashboard',
      createdAt: new Date('2024-01-20'),
      isActive: false
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights and data visualization</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getChangeIcon(metric.changeType)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metric.value)}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className={getChangeColor(metric.changeType)}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-muted-foreground">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages in the last {timeRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page, index) => (
                    <div key={page.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{page.name}</p>
                          <p className="text-sm text-muted-foreground">{page.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(page.value)}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">{source.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{source.value}%</p>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${source.value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Visitors</CardTitle>
                <CardDescription>Currently active users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-green-600">+23</span> in the last 5 minutes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Load Time</CardTitle>
                <CardDescription>Average page load time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.2s</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-green-600">-0.3s</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Overall conversion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.4%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-green-600">+0.2%</span> from last week
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                          <Badge variant={report.type === 'scheduled' ? 'default' : 'secondary'}>
                            {report.type}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Created {report.createdAt.toLocaleDateString()}</span>
                          </div>
                          {report.lastRun && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Last run {report.lastRun.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.isActive ? "default" : "secondary"}>
                        {report.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
