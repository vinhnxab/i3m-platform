// Tenant feature types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  users: number;
  maxUsers: number;
  storage: number;
  maxStorage: number;
  createdAt: string;
  lastLogin: string;
  owner: string;
  billing: {
    monthlyRevenue: number;
    totalRevenue: number;
    nextBilling: string;
    paymentMethod: string;
  };
  features: string[];
  health: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface TenantStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface TenantBilling {
  currentPlan: string;
  monthlyRevenue: number;
  totalRevenue: number;
  nextBilling: string;
  paymentMethod: string;
  invoices: any[];
  usage: {
    users: number;
    storage: number;
    apiCalls: number;
  };
}

export interface TenantState {
  tenants: Tenant[];
  stats: TenantStat[];
  billing: TenantBilling;
  isLoading: boolean;
  error: string | null;
}
