import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Progress } from '@/shared/components/ui';
import { 
  Building2, 
  DollarSign, 
  FolderOpen, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useERP } from '../hooks/useERP';

export function ERPManagement() {
  const { data, projects, invoices, isLoading, error } = useERP();

  if (isLoading) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ERP data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading ERP Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const statsData = [
    { 
      title: 'Total Revenue', 
      value: `$${(data.totalRevenue / 1000).toFixed(0)}K`, 
      icon: DollarSign, 
      color: 'text-chart-2' 
    },
    { 
      title: 'Active Projects', 
      value: data.activeProjects.toString(), 
      icon: FolderOpen, 
      color: 'text-chart-3' 
    },
    { 
      title: 'Pending Invoices', 
      value: data.pendingInvoices.toString(), 
      icon: FileText, 
      color: 'text-chart-4' 
    },
    { 
      title: 'Completed Tasks', 
      value: data.completedTasks.toString(), 
      icon: CheckCircle, 
      color: 'text-chart-1' 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2';
      case 'completed': return 'bg-chart-1';
      case 'on-hold': return 'bg-chart-3';
      case 'pending': return 'bg-chart-3';
      case 'paid': return 'bg-chart-1';
      case 'overdue': return 'bg-chart-4';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'on-hold': return <Clock className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'paid': return <CheckCircle className="w-3 h-3" />;
      case 'overdue': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">ERP Management</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Enterprise resource planning and project management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <Building2 className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            Enterprise Ready
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time enterprise data
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-chart-3" />
              <span>Active Projects</span>
            </CardTitle>
            <CardDescription>Current project status and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(project.status)} text-white border-0`}
                  >
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Team: {project.team.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-chart-4" />
              <span>Recent Invoices</span>
            </CardTitle>
            <CardDescription>Invoice status and payment tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{invoice.id}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(invoice.status)} text-white border-0`}
                  >
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1 capitalize">{invoice.status}</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{invoice.client}</p>
                  <p className="text-xs text-muted-foreground">{invoice.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Amount: ${invoice.amount.toLocaleString()}</span>
                    <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>ERP Quick Actions</span>
          </CardTitle>
          <CardDescription>Common enterprise resource planning tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'New Project', icon: FolderOpen, color: 'bg-chart-3' },
              { name: 'Create Invoice', icon: FileText, color: 'bg-chart-4' },
              { name: 'Add Task', icon: CheckCircle, color: 'bg-chart-1' },
              { name: 'Reports', icon: TrendingUp, color: 'bg-primary' },
              { name: 'Budget', icon: DollarSign, color: 'bg-chart-2' },
              { name: 'Team', icon: Building2, color: 'bg-muted' }
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={action.name} className="flex flex-col items-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
