export interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface SystemService {
  service: string;
  status: 'operational' | 'maintenance' | 'down';
  uptime: string;
}

export interface ActivityItem {
  type: 'customer' | 'order' | 'support' | 'payment';
  action: string;
  time: string;
  customer: string;
}

export interface LogoEffect {
  name: string;
  description: string;
  effect: 'default' | 'rainbow' | 'colorshift' | 'loading';
  size?: 'sm' | 'md' | 'lg';
}
