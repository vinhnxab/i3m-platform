// Mock Ecommerce Stats Data
export interface MockEcommerceStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export const mockEcommerceStats: MockEcommerceStat[] = [
  { 
    title: 'Total Products', 
    value: '2,847', 
    change: '+124', 
    icon: 'Package', 
    color: 'text-blue-500' 
  },
  { 
    title: 'Orders Today', 
    value: '89', 
    change: '+12', 
    icon: 'ShoppingCart', 
    color: 'text-green-500' 
  },
  { 
    title: 'Revenue', 
    value: '$45.2K', 
    change: '+18%', 
    icon: 'DollarSign', 
    color: 'text-purple-500' 
  },
  { 
    title: 'Active Customers', 
    value: '1,429', 
    change: '+8%', 
    icon: 'Users', 
    color: 'text-orange-500' 
  }
];
