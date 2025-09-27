import React from 'react';
import { 
  FeatureCard, 
  PermissionButton, 
  DashboardWidget, 
  RoleBasedContent,
  PermissionData 
} from './PermissionAwareComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Users, 
  BarChart3, 
  ShoppingCart, 
  MessageSquare, 
  Store, 
  Package,
  Calendar,
  Workflow,
  Brain,
  Shield,
  Activity,
  Database,
  Globe,
  Settings,
  Building,
  UserCheck,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';

export const PermissionDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Role-based welcome section */}
      <RoleBasedContent>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>Platform Management Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">Welcome to the platform management interface. You have full access to all platform features.</p>
          </CardContent>
        </Card>
      </RoleBasedContent>

      <RoleBasedContent>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <span>Tenant Management Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">Welcome to your tenant dashboard. Manage your organization's resources and team.</p>
          </CardContent>
        </Card>
      </RoleBasedContent>

      <RoleBasedContent>
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-orange-600" />
              <span>Developer Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">Welcome to the developer workspace. Access development tools and APIs.</p>
          </CardContent>
        </Card>
      </RoleBasedContent>

      <RoleBasedContent>
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              <span>Customer Portal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700">Welcome to your customer portal. Access your services and support.</p>
          </CardContent>
        </Card>
      </RoleBasedContent>

      {/* Core Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardWidget feature="overview" title="System Overview" icon={BarChart3}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="text-2xl font-bold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="text-2xl font-bold text-green-600">$45,678</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Growth</span>
              <span className="text-2xl font-bold text-blue-600">+12.5%</span>
            </div>
          </div>
        </DashboardWidget>

        <DashboardWidget feature="analytics" title="Analytics" icon={TrendingUp}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Page Views</span>
              <span className="text-2xl font-bold">89,123</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sessions</span>
              <span className="text-2xl font-bold">12,456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conversion</span>
              <span className="text-2xl font-bold text-green-600">3.2%</span>
            </div>
          </div>
        </DashboardWidget>

        <DashboardWidget feature="customers" title="Customer Management" icon={Users}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Customers</span>
              <span className="text-2xl font-bold">2,456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New This Month</span>
              <span className="text-2xl font-bold text-green-600">+234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="text-2xl font-bold text-blue-600">1,890</span>
            </div>
          </div>
        </DashboardWidget>
      </div>

      {/* Business Management Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          feature="ecommerce" 
          title="E-commerce Management" 
          description="Manage your online store and sales"
          icon={ShoppingCart}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Orders</span>
              <span className="font-semibold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="font-semibold text-green-600">$12,345</span>
            </div>
            <PermissionButton feature="ecommerce" variant="outline" size="sm">
              View Orders
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="cms" 
          title="Content Management" 
          description="Manage your website content and pages"
          icon={Package}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pages</span>
              <span className="font-semibold">456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Published</span>
              <span className="font-semibold text-green-600">423</span>
            </div>
            <PermissionButton feature="cms" variant="outline" size="sm">
              Manage Content
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="erp" 
          title="ERP Management" 
          description="Enterprise resource planning system"
          icon={Building}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Modules</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-600">10</span>
            </div>
            <PermissionButton feature="erp" variant="outline" size="sm">
              Configure ERP
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="livechat" 
          title="Live Chat" 
          description="Real-time customer support"
          icon={MessageSquare}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Chats</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="font-semibold text-green-600">2.3s</span>
            </div>
            <PermissionButton feature="livechat" variant="outline" size="sm">
              Open Chat
            </PermissionButton>
          </div>
        </FeatureCard>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          feature="aiml" 
          title="AI/ML Dashboard" 
          description="Artificial intelligence and machine learning tools"
          icon={Brain}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Models</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Training</span>
              <span className="font-semibold text-blue-600">In Progress</span>
            </div>
            <PermissionButton feature="aiml" variant="outline" size="sm">
              View Models
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="security" 
          title="Security Center" 
          description="Security monitoring and management"
          icon={Shield}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Threats</span>
              <span className="font-semibold text-red-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Protected</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <PermissionButton feature="security" variant="outline" size="sm">
              View Security
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="performance" 
          title="Performance Monitor" 
          description="System performance analytics"
          icon={Activity}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Load</span>
              <span className="font-semibold text-blue-600">45%</span>
            </div>
            <PermissionButton feature="performance" variant="outline" size="sm">
              View Metrics
            </PermissionButton>
          </div>
        </FeatureCard>
      </div>

      {/* System Management Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          feature="tenants" 
          title="Tenant Management" 
          description="Manage platform tenants and billing"
          icon={Building}
          requireFullAccess
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Tenants</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-600">142</span>
            </div>
            <PermissionButton feature="tenants" variant="outline" size="sm" requireFullAccess>
              Manage Tenants
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="teams" 
          title="Team Management" 
          description="Manage team members and permissions"
          icon={UserCheck}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Members</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Online</span>
              <span className="font-semibold text-green-600">18</span>
            </div>
            <PermissionButton feature="teams" variant="outline" size="sm">
              Manage Team
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="api" 
          title="API Management" 
          description="API configuration and monitoring"
          icon={Globe}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Endpoints</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Requests</span>
              <span className="font-semibold text-blue-600">2.4M</span>
            </div>
            <PermissionButton feature="api" variant="outline" size="sm">
              View APIs
            </PermissionButton>
          </div>
        </FeatureCard>

        <FeatureCard 
          feature="backup" 
          title="Backup Management" 
          description="Data backup and recovery"
          icon={Database}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="font-semibold text-green-600">2h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Size</span>
              <span className="font-semibold">1.2TB</span>
            </div>
            <PermissionButton feature="backup" variant="outline" size="sm">
              Manage Backup
            </PermissionButton>
          </div>
        </FeatureCard>
      </div>

      {/* Permission-based data sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionData feature="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="text-2xl font-bold">$123,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <span className="text-2xl font-bold text-green-600">+15.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="text-2xl font-bold">8,901</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionData>

        <PermissionData feature="customers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Customer Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Customers</span>
                  <span className="text-2xl font-bold">2,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New This Month</span>
                  <span className="text-2xl font-bold text-green-600">+234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Retention Rate</span>
                  <span className="text-2xl font-bold text-blue-600">94.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionData>
      </div>
    </div>
  );
};
