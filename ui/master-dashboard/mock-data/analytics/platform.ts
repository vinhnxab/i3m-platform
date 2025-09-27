// Mock Platform Metrics Data for Analytics
export interface MockPlatformMetric {
  module: string;
  users: number;
  sessions: number;
  avgDuration: string;
  engagement: string;
}

export const mockPlatformMetrics: MockPlatformMetric[] = [
  { 
    module: 'ERP System', 
    users: 8234, 
    sessions: 45678, 
    avgDuration: '24m', 
    engagement: '87%' 
  },
  { 
    module: 'CMS Management', 
    users: 6789, 
    sessions: 34567, 
    avgDuration: '18m', 
    engagement: '82%' 
  },
  { 
    module: 'E-commerce', 
    users: 12456, 
    sessions: 67890, 
    avgDuration: '31m', 
    engagement: '91%' 
  },
  { 
    module: 'Support System', 
    users: 4567, 
    sessions: 23456, 
    avgDuration: '12m', 
    engagement: '78%' 
  }
];
