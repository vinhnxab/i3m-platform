import { 
  Workflow, 
  Play, 
  CheckCircle,
  Timer,
  GitBranch,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Zap,
  RefreshCw,
  Settings,
  ArrowRight,
} from 'lucide-react';

export const DEFAULT_WORKFLOW_STATS = [
  { title: 'Active Workflows', value: '47', change: '+6', icon: Workflow, color: 'text-blue-500' },
  { title: 'Executions Today', value: '1,234', change: '+18%', icon: Play, color: 'text-green-500' },
  { title: 'Success Rate', value: '96.8%', change: '+2.1%', icon: CheckCircle, color: 'text-purple-500' },
  { title: 'Avg Execution Time', value: '2.4s', change: '-0.3s', icon: Timer, color: 'text-orange-500' },
];

export const WORKFLOW_STATUS_COLORS = {
  active: {
    badge: 'bg-green-500/10 text-green-600 border-green-500/20',
    dot: 'bg-green-500'
  },
  paused: {
    badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    dot: 'bg-yellow-500'
  },
  scheduled: {
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    dot: 'bg-blue-500'
  },
  draft: {
    badge: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    dot: 'bg-gray-500'
  }
} as const;

export const EXECUTION_STATUS_COLORS = {
  success: {
    badge: 'bg-green-500/10 text-green-600 border-green-500/20',
    dot: 'bg-green-500'
  },
  failed: {
    badge: 'bg-red-500/10 text-red-600 border-red-500/20',
    dot: 'bg-red-500'
  },
  running: {
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    dot: 'bg-blue-500'
  },
  pending: {
    badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    dot: 'bg-yellow-500'
  }
} as const;

export const WORKFLOW_CATEGORIES = [
  'Customer Management',
  'E-commerce',
  'Customer Support',
  'Inventory',
  'Analytics',
  'Marketing',
  'Finance',
  'HR',
] as const;

export const WORKFLOW_TEMPLATES = [
  {
    id: 1,
    name: 'Customer Onboarding',
    description: 'Automated customer registration and welcome sequence',
    category: 'Customer Management',
    complexity: 'simple' as const,
    estimatedTime: '5 minutes',
    useCases: ['New customer setup', 'Welcome emails', 'Account activation'],
    tags: ['onboarding', 'automation', 'email']
  },
  {
    id: 2,
    name: 'Order Processing',
    description: 'Complete order fulfillment workflow',
    category: 'E-commerce',
    complexity: 'medium' as const,
    estimatedTime: '15 minutes',
    useCases: ['Order validation', 'Payment processing', 'Inventory update'],
    tags: ['orders', 'payment', 'inventory']
  },
  {
    id: 3,
    name: 'Support Ticket Routing',
    description: 'Intelligent ticket assignment and escalation',
    category: 'Customer Support',
    complexity: 'complex' as const,
    estimatedTime: '30 minutes',
    useCases: ['Ticket classification', 'Agent assignment', 'Escalation rules'],
    tags: ['support', 'routing', 'ai']
  }
] as const;
