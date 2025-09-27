// Mock KPI Stats Data for Analytics
export interface MockKPIStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  trend: 'up' | 'down';
}

export const mockKPIStats: MockKPIStat[] = [
  { 
    title: 'Total Revenue', 
    value: '$1.2M', 
    change: '+23%', 
    icon: 'DollarSign', 
    color: 'text-chart-2', 
    trend: 'up' 
  },
  { 
    title: 'Active Users', 
    value: '45.2K', 
    change: '+12%', 
    icon: 'Users', 
    color: 'text-chart-1', 
    trend: 'up' 
  },
  { 
    title: 'Page Views', 
    value: '2.8M', 
    change: '+18%', 
    icon: 'Eye', 
    color: 'text-chart-5', 
    trend: 'up' 
  },
  { 
    title: 'Conversion Rate', 
    value: '3.4%', 
    change: '-0.2%', 
    icon: 'MousePointer', 
    color: 'text-chart-3', 
    trend: 'down' 
  }
];
