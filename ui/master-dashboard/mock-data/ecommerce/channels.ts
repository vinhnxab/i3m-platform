// Mock Ecommerce Sales Channels Data
export interface MockSalesChannel {
  name: string;
  revenue: string;
  orders: number;
  growth: string;
}

export const mockSalesChannels: MockSalesChannel[] = [
  { 
    name: 'Direct Website', 
    revenue: '$234K', 
    orders: 1247, 
    growth: '+23%' 
  },
  { 
    name: 'Partner Network', 
    revenue: '$156K', 
    orders: 893, 
    growth: '+18%' 
  },
  { 
    name: 'Marketplace', 
    revenue: '$89K', 
    orders: 567, 
    growth: '+12%' 
  },
  { 
    name: 'Mobile App', 
    revenue: '$67K', 
    orders: 423, 
    growth: '+8%' 
  }
];
