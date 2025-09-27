import { useState, useEffect } from 'react';
import { TeamState, TeamMember, TeamStat, TeamRole, TeamPermission } from '../types';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    avatar: '/avatars/john.jpg',
    lastLogin: '2024-01-15',
    joinedAt: '2023-06-15',
    permissions: ['all'],
    department: 'Engineering',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'manager',
    status: 'active',
    avatar: '/avatars/jane.jpg',
    lastLogin: '2024-01-14',
    joinedAt: '2023-08-20',
    permissions: ['read', 'write', 'manage_users'],
    department: 'Marketing',
    phone: '+1 (555) 987-6543'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: 'user',
    status: 'pending',
    avatar: '/avatars/bob.jpg',
    lastLogin: '2024-01-10',
    joinedAt: '2024-01-10',
    permissions: ['read'],
    department: 'Sales'
  }
];

const mockStats: TeamStat[] = [
  { title: 'Total Members', value: '24', change: '+3', icon: Users, color: 'text-blue-500' },
  { title: 'Active Members', value: '22', change: '+2', icon: UserCheck, color: 'text-green-500' },
  { title: 'Pending Invites', value: '2', change: '+1', icon: UserX, color: 'text-orange-500' },
  { title: 'Admin Users', value: '3', change: '0', icon: Activity, color: 'text-purple-500' },
];

const mockRoles: TeamRole[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all features and settings',
    permissions: ['all'],
    memberCount: 3,
    isDefault: false
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Can manage users and most features',
    permissions: ['read', 'write', 'manage_users'],
    memberCount: 5,
    isDefault: false
  },
  {
    id: '3',
    name: 'User',
    description: 'Standard user access',
    permissions: ['read', 'write'],
    memberCount: 15,
    isDefault: true
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['read'],
    memberCount: 1,
    isDefault: false
  }
];

const mockPermissions: TeamPermission[] = [
  {
    id: '1',
    name: 'Read Access',
    description: 'View data and reports',
    category: 'Basic',
    enabled: true
  },
  {
    id: '2',
    name: 'Write Access',
    description: 'Create and edit content',
    category: 'Basic',
    enabled: true
  },
  {
    id: '3',
    name: 'User Management',
    description: 'Manage team members',
    category: 'Administration',
    enabled: false
  },
  {
    id: '4',
    name: 'Billing Access',
    description: 'View and manage billing',
    category: 'Administration',
    enabled: false
  }
];

export function useTeam() {
  const [state, setState] = useState<TeamState>({
    teamMembers: [],
    stats: [],
    roles: [],
    permissions: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          teamMembers: mockTeamMembers,
          stats: mockStats,
          roles: mockRoles,
          permissions: mockPermissions,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load team data',
        }));
      }
    };

    loadTeamData();
  }, []);

  const refreshData = async () => {
    console.log('Refreshing team data...');
  };

  return {
    ...state,
    refreshData,
  };
}
