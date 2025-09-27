import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  DollarSign,
  Zap,
  Palette,
} from 'lucide-react';

export const DEFAULT_STATS = [
  { title: 'Total Customers', value: '2,847', change: '+12%', icon: Users, color: 'text-primary' },
  { title: 'Monthly Revenue', value: '$847K', change: '+23%', icon: DollarSign, color: 'text-chart-2' },
  { title: 'Active Orders', value: '1,429', change: '+8%', icon: ShoppingCart, color: 'text-chart-3' },
  { title: 'Support Tickets', value: '142', change: '-15%', icon: MessageSquare, color: 'text-chart-4' },
];

export const DEFAULT_SYSTEM_STATUS = [
  { service: 'Authentication Service', status: 'operational' as const, uptime: '99.9%' },
  { service: 'Customer Management', status: 'operational' as const, uptime: '99.8%' },
  { service: 'E-commerce Engine', status: 'operational' as const, uptime: '99.5%' },
  { service: 'CMS Service', status: 'maintenance' as const, uptime: '98.2%' },
];

export const DEFAULT_RECENT_ACTIVITY = [
  { type: 'customer' as const, action: 'New customer registered', time: '2 minutes ago', customer: 'TechStart Inc.' },
  { type: 'order' as const, action: 'Large order processed', time: '8 minutes ago', customer: 'Enterprise Solutions' },
  { type: 'support' as const, action: 'Ticket resolved', time: '20 minutes ago', customer: 'StartupCo' },
  { type: 'payment' as const, action: 'Payment processed', time: '25 minutes ago', customer: 'Enterprise Corp' },
];

export const LOGO_EFFECTS = [
  { name: 'Default', description: 'Gentle glow effect', effect: 'default' as const },
  { name: 'Rainbow', description: 'Full spectrum flow', effect: 'rainbow' as const },
  { name: 'Color Shift', description: 'Elegant transitions', effect: 'colorshift' as const },
  { name: 'Loading', description: 'With motion effects', effect: 'loading' as const },
];

export const ACTIVITY_TYPE_COLORS = {
  customer: 'bg-chart-1',
  order: 'bg-chart-2',
  support: 'bg-chart-3',
  payment: 'bg-chart-5',
} as const;

export const STATUS_COLORS = {
  operational: {
    dot: 'bg-chart-2',
    badge: 'bg-chart-2/10 text-chart-2 border-chart-2/30'
  },
  maintenance: {
    dot: 'bg-chart-3',
    badge: 'bg-chart-3/10 text-chart-3 border-chart-3/30'
  },
  down: {
    dot: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-500 border-red-500/30'
  }
} as const;
