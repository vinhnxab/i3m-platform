import { useState, useEffect } from 'react';
import { CustomerState, Customer, CustomerStat } from '../types';
import { Building2, Users, CreditCard, Clock } from 'lucide-react';

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    industry: 'Technology',
    size: 'Enterprise',
    employees: 5000,
    plan: 'Enterprise Pro',
    mrr: '$4,999',
    status: 'active',
    health: 'excellent',
    lastLogin: '2024-01-15',
    joinDate: '2023-06-15',
    contact: 'john.doe@techcorp.com',
    phone: '+1 (555) 123-4567',
    usage: 98
  },
  {
    id: 2,
    name: 'StartupCo',
    industry: 'Fintech',
    size: 'Startup',
    employees: 25,
    plan: 'Professional',
    mrr: '$299',
    status: 'trial',
    health: 'good',
    lastLogin: '2024-01-14',
    joinDate: '2024-01-01',
    contact: 'jane@startupco.com',
    phone: '+1 (555) 987-6543',
    usage: 75
  }
];

const mockStats: CustomerStat[] = [
  { title: 'Total Customers', value: '2,847', change: '+124', icon: Building2, color: 'text-blue-500' },
  { title: 'Enterprise Clients', value: '147', change: '+12', icon: Users, color: 'text-green-500' },
  { title: 'Active Subscriptions', value: '2,631', change: '+98', icon: CreditCard, color: 'text-purple-500' },
  { title: 'Trial Customers', value: '216', change: '+23', icon: Clock, color: 'text-orange-500' },
];

export function useCustomers() {
  const [state, setState] = useState<CustomerState>({
    customers: [],
    stats: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          customers: mockCustomers,
          stats: mockStats,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load customer data',
        }));
      }
    };

    loadCustomerData();
  }, []);

  const refreshData = async () => {
    console.log('Refreshing customer data...');
  };

  return {
    ...state,
    refreshData,
  };
}
