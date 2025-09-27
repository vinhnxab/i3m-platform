// Mock ERP Financial Data
export interface MockFinancialData {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export const mockFinancialData: MockFinancialData[] = [
  { 
    title: 'Total Revenue', 
    value: '$2.4M', 
    change: '+18%', 
    icon: 'DollarSign', 
    color: 'text-green-500' 
  },
  { 
    title: 'Operating Expenses', 
    value: '$1.8M', 
    change: '+12%', 
    icon: 'TrendingUp', 
    color: 'text-blue-500' 
  },
  { 
    title: 'Profit Margin', 
    value: '25%', 
    change: '+3%', 
    icon: 'TrendingUp', 
    color: 'text-purple-500' 
  },
  { 
    title: 'Outstanding Invoices', 
    value: '$345K', 
    change: '-8%', 
    icon: 'AlertTriangle', 
    color: 'text-orange-500' 
  }
];
