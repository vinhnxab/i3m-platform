export interface WorkflowStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface Workflow {
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

export interface Execution {
  id: number;
  workflowName: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  startTime: string;
  endTime?: string;
  duration?: string;
  trigger: string;
  error?: string;
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  useCases: string[];
  tags: string[];
}
