import { useState, useEffect } from 'react';
import { TenantState, Tenant, TenantStat, TenantBilling } from '../types';
import { Building2, Users, DollarSign, Activity } from 'lucide-react';

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    domain: 'techcorp.i3m.com',
    plan: 'enterprise',
    status: 'active',
    users: 45,
    maxUsers: 100,
    storage: 250,
    maxStorage: 1000,
    createdAt: '2023-06-15',
    lastLogin: '2024-01-15',
    owner: 'john.doe@techcorp.com',
    billing: {
      monthlyRevenue: 4999,
      totalRevenue: 59988,
      nextBilling: '2024-02-15',
      paymentMethod: 'Credit Card'
    },
    features: ['ERP', 'E-commerce', 'CMS', 'Analytics'],
    health: 'excellent'
  },
  {
    id: '2',
    name: 'StartupCo',
    domain: 'startupco.i3m.com',
    plan: 'professional',
    status: 'trial',
    users: 8,
    maxUsers: 25,
    storage: 50,
    maxStorage: 100,
    createdAt: '2024-01-01',
    lastLogin: '2024-01-14',
    owner: 'jane@startupco.com',
    billing: {
      monthlyRevenue: 299,
      totalRevenue: 299,
      nextBilling: '2024-02-01',
      paymentMethod: 'PayPal'
    },
    features: ['E-commerce', 'CMS'],
    health: 'good'
  }
];

const mockStats: TenantStat[] = [
  { title: 'Total Tenants', value: '1,247', change: '+23', icon: Building2, color: 'text-blue-500' },
  { title: 'Active Tenants', value: '1,189', change: '+45', icon: Activity, color: 'text-green-500' },
  { title: 'Total Users', value: '8,456', change: '+234', icon: Users, color: 'text-purple-500' },
  { title: 'Monthly Revenue', value: '$45,678', change: '+12%', icon: DollarSign, color: 'text-orange-500' },
];

const mockBilling: TenantBilling = {
  currentPlan: 'Enterprise',
  monthlyRevenue: 45678,
  totalRevenue: 547890,
  nextBilling: '2024-02-15',
  paymentMethod: 'Credit Card',
  invoices: [],
  usage: {
    users: 8456,
    storage: 125000,
    apiCalls: 1250000
  }
};

export function useTenants() {
  const [state, setState] = useState<TenantState>({
    tenants: [],
    stats: [],
    billing: mockBilling,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadTenantData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          tenants: mockTenants,
          stats: mockStats,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load tenant data',
        }));
      }
    };

    loadTenantData();
  }, []);

  const refreshData = async () => {
    console.log('Refreshing tenant data...');
  };

  return {
    ...state,
    refreshData,
  };
}
