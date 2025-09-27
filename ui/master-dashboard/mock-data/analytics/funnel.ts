// Mock Conversion Funnel Data for Analytics
export interface MockConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export const mockConversionFunnel: MockConversionFunnel[] = [
  { 
    stage: 'Visitors', 
    count: 125000, 
    percentage: 100 
  },
  { 
    stage: 'Signups', 
    count: 12500, 
    percentage: 10 
  },
  { 
    stage: 'Trial Users', 
    count: 8750, 
    percentage: 7 
  },
  { 
    stage: 'Paid Customers', 
    count: 3125, 
    percentage: 2.5 
  },
  { 
    stage: 'Enterprise', 
    count: 625, 
    percentage: 0.5 
  }
];
