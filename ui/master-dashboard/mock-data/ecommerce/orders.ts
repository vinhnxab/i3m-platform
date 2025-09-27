// Mock Ecommerce Orders Data
export interface MockOrder {
  id: number;
  customer: string;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

export const mockOrders: MockOrder[] = [
  { 
    id: 1, 
    customer: 'John Smith', 
    total: '$1,299', 
    status: 'processing', 
    date: '2024-01-15', 
    items: 3 
  },
  { 
    id: 2, 
    customer: 'Sarah Johnson', 
    total: '$599', 
    status: 'shipped', 
    date: '2024-01-14', 
    items: 2 
  },
  { 
    id: 3, 
    customer: 'Mike Chen', 
    total: '$299', 
    status: 'delivered', 
    date: '2024-01-13', 
    items: 1 
  },
  { 
    id: 4, 
    customer: 'Emily Davis', 
    total: '$2,499', 
    status: 'pending', 
    date: '2024-01-16', 
    items: 1 
  }
];
