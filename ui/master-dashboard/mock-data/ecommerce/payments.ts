// Mock Ecommerce Payments Data
export interface MockPayment {
  id: string;
  order: string;
  amount: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  fees: string;
}

export const mockPayments: MockPayment[] = [
  {
    id: 'PAY-001',
    order: 'ORD-001',
    amount: '$2,999',
    method: 'Credit Card',
    status: 'success',
    date: '2024-01-15',
    fees: '$89.97'
  },
  {
    id: 'PAY-002',
    order: 'ORD-002',
    amount: '$599',
    method: 'PayPal',
    status: 'success',
    date: '2024-01-15',
    fees: '$17.97'
  },
  {
    id: 'PAY-003',
    order: 'ORD-003',
    amount: '$4,999',
    method: 'Bank Transfer',
    status: 'pending',
    date: '2024-01-14',
    fees: '$0'
  },
  {
    id: 'PAY-004',
    order: 'ORD-004',
    amount: '$1,299',
    method: 'Credit Card',
    status: 'success',
    date: '2024-01-14',
    fees: '$38.97'
  }
];
