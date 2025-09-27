import { useState, useEffect } from 'react';
import { SecurityState, SecurityThreat, SecurityStat } from '../types';
import { Shield, AlertTriangle, Ban, CheckCircle } from 'lucide-react';

const mockThreats: SecurityThreat[] = [
  {
    id: 1,
    type: 'SQL Injection Attempt',
    severity: 'high',
    source: '192.168.1.100',
    target: 'Customer Database',
    status: 'blocked',
    timestamp: '2024-01-15 14:35:22',
    description: 'Malicious SQL injection attempt detected on login endpoint',
    actions: ['IP Blocked', 'Alert Sent', 'Log Created']
  },
  {
    id: 2,
    type: 'Brute Force Attack',
    severity: 'medium',
    source: '10.0.0.50',
    target: 'Admin Panel',
    status: 'active',
    timestamp: '2024-01-15 13:22:15',
    description: 'Multiple failed login attempts detected',
    actions: ['Rate Limited', 'Alert Sent']
  }
];

const mockStats: SecurityStat[] = [
  { title: 'Security Score', value: '94.7%', change: '+2.1%', icon: Shield, color: 'text-green-500' },
  { title: 'Active Threats', value: '3', change: '-5', icon: AlertTriangle, color: 'text-red-500' },
  { title: 'Blocked Attacks', value: '1,247', change: '+23%', icon: Ban, color: 'text-blue-500' },
  { title: 'Compliance Status', value: '98.9%', change: '+0.8%', icon: CheckCircle, color: 'text-purple-500' },
];

export function useSecurity() {
  const [state, setState] = useState<SecurityState>({
    threats: [],
    stats: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          threats: mockThreats,
          stats: mockStats,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load security data',
        }));
      }
    };

    loadSecurityData();
  }, []);

  const refreshData = async () => {
    console.log('Refreshing security data...');
  };

  return {
    ...state,
    refreshData,
  };
}
