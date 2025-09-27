import { 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  DollarSign
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingState, ErrorState } from '@/shared/components/dashboard';
import { 
  DashboardHeader, 
  StatsGrid, 
  SystemStatus, 
  RecentActivity, 
  QuickActions,
  Charts
} from './';

export function DashboardOverview() {
  const { stats, systemStatus, recentActivity, isLoading, error } = useDashboard();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const statsData = [
    { 
      title: 'Total Customers', 
      value: stats.totalCustomers.toLocaleString(), 
      change: '+12%', 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      title: 'Monthly Revenue', 
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`, 
      change: '+23%', 
      icon: DollarSign, 
      color: 'text-chart-2' 
    },
    { 
      title: 'Active Orders', 
      value: stats.activeOrders.toLocaleString(), 
      change: '+8%', 
      icon: ShoppingCart, 
      color: 'text-chart-3' 
    },
    { 
      title: 'Support Tickets', 
      value: stats.supportTickets.toString(), 
      change: '-15%', 
      icon: MessageSquare, 
      color: 'text-chart-4' 
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      change: '+18%', 
      icon: Users, 
      color: 'text-chart-1' 
    },
    { 
      title: 'Total Products', 
      value: stats.totalProducts.toString(), 
      change: '+5%', 
      icon: ShoppingCart, 
      color: 'text-chart-5' 
    },
    { 
      title: 'Conversion Rate', 
      value: `${stats.conversionRate}%`, 
      change: '+2.1%', 
      icon: DollarSign, 
      color: 'text-chart-6' 
    },
    { 
      title: 'Avg Order Value', 
      value: `$${stats.averageOrderValue.toFixed(2)}`, 
      change: '+7%', 
      icon: DollarSign, 
      color: 'text-chart-7' 
    },
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Grid */}
      <StatsGrid stats={statsData} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4" />

      {/* Charts */}
      <Charts />

      {/* System Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <SystemStatus services={systemStatus} />
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
