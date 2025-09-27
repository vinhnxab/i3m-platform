// Mock Workflow Templates Data
export interface MockWorkflowTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  steps: number;
}

export const mockWorkflowTemplates: MockWorkflowTemplate[] = [
  {
    id: 1,
    name: 'Customer Onboarding',
    description: 'Automated customer registration and welcome sequence',
    category: 'Customer Management',
    steps: 5
  },
  {
    id: 2,
    name: 'Order Processing',
    description: 'Complete order fulfillment workflow',
    category: 'E-commerce',
    steps: 8
  },
  {
    id: 3,
    name: 'Support Ticket Routing',
    description: 'Intelligent ticket assignment and escalation',
    category: 'Customer Support',
    steps: 6
  }
];
