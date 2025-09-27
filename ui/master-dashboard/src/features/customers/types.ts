// Customer feature types
export interface Customer {
  id: number;
  name: string;
  industry: string;
  size: 'Startup' | 'SME' | 'Enterprise';
  employees: number;
  plan: string;
  mrr: string;
  status: 'active' | 'inactive' | 'trial' | 'churned';
  health: 'excellent' | 'good' | 'warning' | 'critical';
  lastLogin: string;
  joinDate: string;
  contact: string;
  phone: string;
  usage: number;
}

export interface CustomerStat {
  title: string;
  value: string;
  change: string;
  icon: any; // LucideIcon
  color: string;
}

export interface CustomerState {
  customers: Customer[];
  stats: CustomerStat[];
  isLoading: boolean;
  error: string | null;
}
