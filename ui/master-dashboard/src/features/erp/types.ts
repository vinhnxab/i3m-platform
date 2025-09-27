// ERP feature types
export interface ERPData {
  totalRevenue: number;
  activeProjects: number;
  pendingInvoices: number;
  completedTasks: number;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  team: string[];
  deadline: string;
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  description: string;
}

export interface ERPState {
  data: ERPData;
  projects: Project[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
}
