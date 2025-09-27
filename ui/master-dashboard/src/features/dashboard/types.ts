// Dashboard feature types
export interface DashboardStats {
  totalCustomers: number;
  monthlyRevenue: number;
  activeOrders: number;
  supportTickets: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

export interface SystemStatus {
  service: string;
  status: 'operational' | 'maintenance' | 'error';
  uptime: string;
}

export interface RecentActivity {
  type: 'customer' | 'order' | 'support' | 'system';
  action: string;
  time: string;
  customer: string;
}

export interface DashboardState {
  stats: DashboardStats;
  systemStatus: SystemStatus[];
  recentActivity: RecentActivity[];
  isLoading: boolean;
  error: string | null;
}
