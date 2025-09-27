// Mock Execution History Data for Workflow Management
export interface MockExecution {
  id: number;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  duration: string;
  trigger: string;
}

export const mockExecutions: MockExecution[] = [
  {
    id: 1,
    workflowName: 'Customer Onboarding Automation',
    status: 'success',
    startTime: '2024-01-15 14:30:15',
    endTime: '2024-01-15 14:30:58',
    duration: '43s',
    trigger: 'john.doe@example.com registered'
  },
  {
    id: 2,
    workflowName: 'Order Processing Pipeline',
    status: 'running',
    startTime: '2024-01-15 14:45:22',
    duration: '8s',
    trigger: 'Order #ORD-12345 placed'
  },
  {
    id: 3,
    workflowName: 'Support Ticket Routing',
    status: 'success',
    startTime: '2024-01-15 14:20:11',
    endTime: '2024-01-15 14:20:14',
    duration: '3s',
    trigger: 'Ticket #TKT-789 created'
  },
  {
    id: 4,
    workflowName: 'Order Processing Pipeline',
    status: 'failed',
    startTime: '2024-01-15 14:12:45',
    endTime: '2024-01-15 14:12:50',
    duration: '5s',
    trigger: 'Order #ORD-12344 placed'
  }
];
