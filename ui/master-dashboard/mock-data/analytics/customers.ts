// Mock Customer Metrics Data for Analytics
export interface MockCustomerMetric {
  segment: string;
  customers: number;
  revenue: string;
  growth: string;
  retention: string;
}

export const mockCustomerMetrics: MockCustomerMetric[] = [
  { 
    segment: 'Enterprise', 
    customers: 847, 
    revenue: '$845K', 
    growth: '+28%', 
    retention: '94%' 
  },
  { 
    segment: 'Medium Business', 
    customers: 2156, 
    revenue: '$432K', 
    growth: '+15%', 
    retention: '89%' 
  },
  { 
    segment: 'Small Business', 
    customers: 5234, 
    revenue: '$234K', 
    growth: '+22%', 
    retention: '76%' 
  },
  { 
    segment: 'Startups', 
    customers: 3421, 
    revenue: '$156K', 
    growth: '+31%', 
    retention: '68%' 
  }
];
