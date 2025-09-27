// Mock Workflows Data for Workflow Management
export interface MockWorkflow {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'scheduled' | 'draft';
  trigger: string;
  lastRun: string;
  executions: number;
  successRate: number;
  avgTime: string;
  category: string;
  steps: number;
}

export const mockWorkflows: MockWorkflow[] = [
  {
    id: 1,
    name: 'Customer Onboarding Automation',
    description: 'Automated workflow for new customer setup and welcome sequence',
    status: 'active',
    trigger: 'Customer Registration',
    lastRun: '2024-01-15 14:30',
    executions: 156,
    successRate: 98.7,
    avgTime: '45s',
    category: 'Customer Management',
    steps: 8
  },
  {
    id: 2,
    name: 'Order Processing Pipeline',
    description: 'End-to-end order processing from payment to fulfillment',
    status: 'active',
    trigger: 'Order Placed',
    lastRun: '2024-01-15 14:45',
    executions: 423,
    successRate: 99.2,
    avgTime: '12s',
    category: 'E-commerce',
    steps: 12
  },
  {
    id: 3,
    name: 'Support Ticket Routing',
    description: 'Intelligent routing of support tickets to appropriate agents',
    status: 'active',
    trigger: 'Ticket Created',
    lastRun: '2024-01-15 14:20',
    executions: 89,
    successRate: 94.4,
    avgTime: '3s',
    category: 'Customer Support',
    steps: 6
  },
  {
    id: 4,
    name: 'Inventory Restock Alert',
    description: 'Automated alerts and reorder process for low stock items',
    status: 'paused',
    trigger: 'Stock Level Low',
    lastRun: '2024-01-14 09:15',
    executions: 23,
    successRate: 91.3,
    avgTime: '8s',
    category: 'Inventory',
    steps: 5
  },
  {
    id: 5,
    name: 'Monthly Report Generation',
    description: 'Automated generation and distribution of monthly business reports',
    status: 'scheduled',
    trigger: 'Monthly Schedule',
    lastRun: '2024-01-01 02:00',
    executions: 12,
    successRate: 100,
    avgTime: '1m 30s',
    category: 'Analytics',
    steps: 4
  }
];
