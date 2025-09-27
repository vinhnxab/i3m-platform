// Security feature types
export interface SecurityThreat {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'active' | 'blocked' | 'resolved';
  timestamp: string;
  description: string;
  actions: string[];
}

export interface SecurityStat {
  title: string;
  value: string;
  change: string;
  icon: any; // LucideIcon
  color: string;
}

export interface SecurityState {
  threats: SecurityThreat[];
  stats: SecurityStat[];
  isLoading: boolean;
  error: string | null;
}
