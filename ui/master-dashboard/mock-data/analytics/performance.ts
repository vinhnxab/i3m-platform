// Mock Performance Metrics Data for Analytics
export interface MockPerformanceMetric {
  metric: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'critical' | 'excellent';
}

export const mockPerformanceMetrics: MockPerformanceMetric[] = [
  { 
    metric: 'API Response Time', 
    value: '142ms', 
    target: '<200ms', 
    status: 'good' 
  },
  { 
    metric: 'Database Query Time', 
    value: '89ms', 
    target: '<100ms', 
    status: 'good' 
  },
  { 
    metric: 'Page Load Time', 
    value: '1.2s', 
    target: '<2s', 
    status: 'good' 
  },
  { 
    metric: 'Error Rate', 
    value: '0.08%', 
    target: '<0.1%', 
    status: 'good' 
  },
  { 
    metric: 'Uptime', 
    value: '99.9%', 
    target: '>99.5%', 
    status: 'excellent' 
  }
];
