import { useState, useEffect } from 'react';
import { DashboardState, DashboardStats, SystemStatus, RecentActivity } from '@/features/dashboard/types';

const mockStats: DashboardStats = {
  totalCustomers: 2847,
  monthlyRevenue: 847000,
  activeOrders: 1429,
  supportTickets: 142,
  totalUsers: 1250,
  totalProducts: 89,
  totalRevenue: 1250000,
  conversionRate: 3.2,
  averageOrderValue: 125.50,
  monthlyGrowth: 12.5,
};

const mockSystemStatus: SystemStatus[] = [
  { service: 'Authentication Service', status: 'operational', uptime: '99.9%' },
  { service: 'Customer Management', status: 'operational', uptime: '99.8%' },
  { service: 'E-commerce Engine', status: 'operational', uptime: '99.5%' },
  { service: 'CMS Service', status: 'maintenance', uptime: '98.2%' },
];

const mockRecentActivity: RecentActivity[] = [
  { type: 'customer', action: 'New customer registered', time: '2 minutes ago', customer: 'TechStart Inc.' },
  { type: 'order', action: 'Large order processed', time: '8 minutes ago', customer: 'Enterprise Solutions' },
  { type: 'support', action: 'Ticket resolved', time: '20 minutes ago', customer: 'StartupCo' },
  { type: 'system', action: 'System update completed', time: '25 minutes ago', customer: 'System Admin' },
];

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    stats: mockStats,
    systemStatus: mockSystemStatus,
    recentActivity: mockRecentActivity,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Simulate API call
    const loadDashboardData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          stats: mockStats,
          systemStatus: mockSystemStatus,
          recentActivity: mockRecentActivity,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load dashboard data',
        }));
      }
    };

    loadDashboardData();
  }, []);

  const refreshData = async () => {
    // Implement refresh logic
    console.log('Refreshing dashboard data...');
  };

  return {
    ...state,
    refreshData,
  };
}
