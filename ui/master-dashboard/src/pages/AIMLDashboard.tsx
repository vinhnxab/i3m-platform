import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress } from '@/shared/components/ui';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target,
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  Lightbulb,
  Cpu,
  Database,
  RefreshCw,
  Play,
  Pause,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

export function AIMLDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const aimlStats = [
    { title: 'Active ML Models', value: '24', change: '+3', icon: Brain, color: 'text-purple-500' },
    { title: 'Predictions Today', value: '156.2K', change: '+18%', icon: Zap, color: 'text-blue-500' },
    { title: 'Model Accuracy', value: '94.7%', change: '+2.1%', icon: Target, color: 'text-green-500' },
    { title: 'Training Jobs', value: '8', change: '+2', icon: Cpu, color: 'text-orange-500' },
  ];

  const mlModels = [
    {
      id: 1,
      name: 'Content Recommendation Engine',
      type: 'Recommendation',
      status: 'active',
      accuracy: 94.7,
      lastTrained: '2024-01-14',
      predictions: 45230,
      usage: 'CMS Module',
      version: 'v2.3.1'
    },
    {
      id: 2,
      name: 'Customer Churn Prediction',
      type: 'Classification',
      status: 'active',
      accuracy: 89.3,
      lastTrained: '2024-01-12',
      predictions: 23450,
      usage: 'Customer Management',
      version: 'v1.8.2'
    },
    {
      id: 3,
      name: 'Product Price Optimization',
      type: 'Regression',
      status: 'training',
      accuracy: 87.6,
      lastTrained: '2024-01-10',
      predictions: 67890,
      usage: 'E-commerce',
      version: 'v3.1.0'
    },
    {
      id: 4,
      name: 'Sentiment Analysis Engine',
      type: 'NLP',
      status: 'active',
      accuracy: 92.1,
      lastTrained: '2024-01-13',
      predictions: 34567,
      usage: 'Support System',
      version: 'v2.7.3'
    },
    {
      id: 5,
      name: 'Fraud Detection System',
      type: 'Anomaly Detection',
      status: 'active',
      accuracy: 96.8,
      lastTrained: '2024-01-15',
      predictions: 12345,
      usage: 'Payment Processing',
      version: 'v1.9.4'
    },
    {
      id: 6,
      name: 'Inventory Demand Forecasting',
      type: 'Time Series',
      status: 'maintenance',
      accuracy: 91.2,
      lastTrained: '2024-01-08',
      predictions: 56789,
      usage: 'Inventory Management',
      version: 'v2.4.1'
    }
  ];

  const trainingJobs = [
    { id: 1, model: 'Content Recommendation Engine', status: 'running', progress: 76, eta: '2h 15m' },
    { id: 2, model: 'Customer Segmentation', status: 'queued', progress: 0, eta: '4h 30m' },
    { id: 3, model: 'Sales Forecasting', status: 'completed', progress: 100, eta: 'Completed' },
    { id: 4, model: 'Support Ticket Classification', status: 'running', progress: 34, eta: '1h 45m' },
  ];

  const insights = [
    {
      title: 'Customer Churn Risk Alert',
      description: '127 customers showing high churn probability this week',
      impact: 'High',
      action: 'Deploy retention campaign',
      confidence: 94.2
    },
    {
      title: 'Product Recommendation Opportunity',
      description: 'Cross-selling potential identified for 2,340 customers',
      impact: 'Medium',
      action: 'Update recommendation engine',
      confidence: 87.6
    },
    {
      title: 'Inventory Optimization',
      description: 'Demand spike predicted for 15 products next month',
      impact: 'High',
      action: 'Adjust inventory levels',
      confidence: 91.3
    },
    {
      title: 'Support Efficiency Improvement',
      description: 'Auto-resolution rate can be improved by 23%',
      impact: 'Medium',
      action: 'Update classification model',
      confidence: 88.9
    }
  ];

  const analyticsData = [
    { module: 'Content Recommendations', accuracy: 94.7, predictions: 45230, improvement: '+5.2%' },
    { module: 'Customer Segmentation', accuracy: 89.3, predictions: 23450, improvement: '+3.1%' },
    { module: 'Price Optimization', accuracy: 87.6, predictions: 67890, improvement: '+7.8%' },
    { module: 'Fraud Detection', accuracy: 96.8, predictions: 12345, improvement: '+2.3%' },
    { module: 'Demand Forecasting', accuracy: 91.2, predictions: 56789, improvement: '+4.5%' },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">AI/ML Dashboard</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Machine Learning and Artificial Intelligence Management</p>
        </div>
        <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            All Systems Operational
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Model Settings
          </Button>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Start Training
          </Button>
        </div>
      </div>

      {/* AI/ML Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {aimlStats.map((stat, index) => {
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

      {/* AI/ML Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Overview</CardTitle>
                <CardDescription>Real-time performance metrics for active models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.slice(0, 4).map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{model.module}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{model.accuracy}%</span>
                          <Badge variant="outline" className="text-green-600">{model.improvement}</Badge>
                        </div>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{model.predictions.toLocaleString()} predictions</span>
                        <span>Accuracy: {model.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Latest AI Insights</CardTitle>
                <CardDescription>Actionable insights from AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant={
                          insight.impact === 'High' ? 'destructive' :
                          insight.impact === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary">{insight.action}</span>
                        <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">GPU Utilization</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">Model Storage</span>
                    <span className="font-medium">45GB / 100GB</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Today</span>
                    <span className="font-medium">156,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium">892,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">3.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Latency</span>
                    <Badge variant="default">45ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Recommendation', count: 8, color: 'bg-blue-500' },
                    { type: 'Classification', count: 6, color: 'bg-green-500' },
                    { type: 'Regression', count: 4, color: 'bg-purple-500' },
                    { type: 'NLP', count: 3, color: 'bg-orange-500' },
                    { type: 'Anomaly Detection', count: 3, color: 'bg-red-500' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ML Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Machine Learning Models</CardTitle>
              <CardDescription>Manage and monitor all deployed ML models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mlModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{model.name}</h4>
                          <Badge variant="outline">{model.type}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Usage: {model.usage}</span>
                          <span>Version: {model.version}</span>
                          <span>Predictions: {model.predictions.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Last trained: {model.lastTrained}</span>
                          <span>Accuracy: {model.accuracy}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        model.status === 'active' ? 'default' :
                        model.status === 'training' ? 'secondary' :
                        model.status === 'maintenance' ? 'outline' : 'destructive'
                      }>
                        {model.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {model.status === 'training' && <Clock className="w-3 h-3 mr-1" />}
                        {model.status === 'maintenance' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {model.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {model.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Training Pipeline</CardTitle>
              <CardDescription>Monitor active training jobs and queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{job.model}</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={
                          job.status === 'running' ? 'default' :
                          job.status === 'completed' ? 'secondary' :
                          job.status === 'queued' ? 'outline' : 'destructive'
                        }>
                          {job.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">ETA: {job.eta}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {job.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                <CardTitle>Training Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">GPU Cluster Usage</span>
                    <span className="font-medium">6/8 GPUs</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">Training Queue</span>
                    <Badge variant="outline">3 jobs waiting</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Training Time</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="default">94.7%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Jobs This Week</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <Badge variant="default">19</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Failed</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Running</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Actionable insights and recommendations from AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <h4 className="font-medium">{insight.title}</h4>
                      </div>
                      <Badge variant={
                        insight.impact === 'High' ? 'destructive' :
                        insight.impact === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {insight.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-primary">Recommended Action:</span>
                        <span className="text-sm">{insight.action}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Badge variant="outline">{insight.confidence}%</Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm">Take Action</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Dismiss</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );}