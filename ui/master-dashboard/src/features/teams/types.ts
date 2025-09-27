// Team feature types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin: string;
  joinedAt: string;
  permissions: string[];
  department?: string;
  phone?: string;
}

export interface TeamStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  isDefault: boolean;
}

export interface TeamPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

export interface TeamState {
  teamMembers: TeamMember[];
  stats: TeamStat[];
  roles: TeamRole[];
  permissions: TeamPermission[];
  isLoading: boolean;
  error: string | null;
}
