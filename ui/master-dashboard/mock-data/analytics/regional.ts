// Mock Regional Data for Analytics
export interface MockRegionalData {
  region: string;
  users: number;
  revenue: string;
  growth: string;
  share: string;
}

export const mockRegionalData: MockRegionalData[] = [
  { 
    region: 'North America', 
    users: 18234, 
    revenue: '$567K', 
    growth: '+25%', 
    share: '42%' 
  },
  { 
    region: 'Europe', 
    users: 14567, 
    revenue: '$423K', 
    growth: '+18%', 
    share: '31%' 
  },
  { 
    region: 'Asia Pacific', 
    users: 8923, 
    revenue: '$234K', 
    growth: '+35%', 
    share: '18%' 
  },
  { 
    region: 'Others', 
    users: 3456, 
    revenue: '$123K', 
    growth: '+12%', 
    share: '9%' 
  }
];
