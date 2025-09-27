// Mock Ecommerce Products Data
export interface MockProduct {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  sales: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  category: string;
}

export const mockProducts: MockProduct[] = [
  { 
    id: 1, 
    name: 'Enterprise License', 
    sku: 'ENT-001', 
    price: '$999', 
    stock: 50, 
    sales: 234,
    status: 'active',
    category: 'Licenses'
  },
  { 
    id: 2, 
    name: 'Premium Theme Bundle', 
    sku: 'THM-002', 
    price: '$299', 
    stock: 0, 
    sales: 156,
    status: 'out-of-stock',
    category: 'Themes'
  },
  { 
    id: 3, 
    name: 'API Access Package', 
    sku: 'API-003', 
    price: '$199', 
    stock: 25, 
    sales: 89,
    status: 'active',
    category: 'Services'
  },
  { 
    id: 4, 
    name: 'Custom Development', 
    sku: 'DEV-004', 
    price: '$2,499', 
    stock: 10, 
    sales: 12,
    status: 'active',
    category: 'Services'
  }
];
