import { RouteConfig } from './types';

export const routes: RouteConfig[] = [
  // 1. CORE DASHBOARD (Essential)
  {
    id: 'overview',
    title: 'Dashboard Overview',
    description: 'System overview and key metrics',
    icon: 'LayoutDashboard',
    path: '/overview'
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    description: 'Comprehensive platform analytics and insights',
    icon: 'BarChart3',
    path: '/analytics'
  },

  // 2. BUSINESS MANAGEMENT (Core Business)
  {
    id: 'customers',
    title: 'Customer Management',
    description: 'Customer relationship management',
    icon: 'Users',
    path: '/customers'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Management',
    description: 'Multi-channel commerce dashboard',
    icon: 'ShoppingCart',
    path: '/ecommerce'
  },
  {
    id: 'erp',
    title: 'ERP Management',
    description: 'Enterprise Resource Planning System',
    icon: 'Building2',
    path: '/erp'
  },
  {
    id: 'cms',
    title: 'CMS Management',
    description: 'Content Management System Dashboard',
    icon: 'FileText',
    path: '/cms'
  },

  // 3. COMMUNICATION & SUPPORT
  {
    id: 'livechat',
    title: 'Live Chat',
    description: 'Real-time customer support and messaging',
    icon: 'MessageSquare',
    path: '/livechat'
  },
  {
    id: 'support',
    title: 'Support Center',
    description: 'Customer support and ticketing',
    icon: 'HelpCircle',
    badge: '5',
    path: '/support'
  },

  // 4. MARKETPLACE & INTEGRATION
  {
    id: 'templates',
    title: 'Template Marketplace',
    description: 'Browse and install templates',
    icon: 'Store',
    path: '/templates'
  },
  {
    id: 'services',
    title: 'Service Marketplace',
    description: 'Discover and integrate services',
    icon: 'Package',
    badge: 'New',
    path: '/services'
  },

  // 5. PROJECT & WORKFLOW
  {
    id: 'scrum',
    title: 'Scrum & Agile',
    description: 'Agile project management',
    icon: 'Calendar',
    badge: 'Sprint',
    path: '/scrum'
  },
  {
    id: 'workflow',
    title: 'Workflow Management',
    description: 'Process automation and workflows',
    icon: 'Workflow',
    badge: 'Auto',
    path: '/workflow'
  },

  // 6. ADVANCED FEATURES
  {
    id: 'aiml',
    title: 'AI/ML Dashboard',
    description: 'Artificial intelligence and machine learning',
    icon: 'Brain',
    badge: 'AI',
    path: '/aiml'
  },
  {
    id: 'security',
    title: 'Security Center',
    description: 'Security settings and monitoring',
    icon: 'Shield',
    badge: '3',
    path: '/security'
  },
  {
    id: 'performance',
    title: 'Performance Monitor',
    description: 'System performance analytics',
    icon: 'Activity',
    path: '/performance'
  },

  // 7. SYSTEM & INFRASTRUCTURE
  {
    id: 'tenants',
    title: 'Tenant Management',
    description: 'Manage platform tenants and billing',
    icon: 'Building',
    path: '/tenants'
  },
  {
    id: 'teams',
    title: 'Team Management',
    description: 'Manage team members and permissions',
    icon: 'UserCheck',
    path: '/teams'
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'Manage platform users and permissions',
    icon: 'Users',
    path: '/users'
  },
  {
    id: 'backup',
    title: 'Backup Management',
    description: 'Data backup and recovery',
    icon: 'Database',
    path: '/backup'
  },
  {
    id: 'api',
    title: 'API Management',
    description: 'API configuration and monitoring',
    icon: 'Globe',
    badge: '2.4M',
    path: '/api'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'System configuration and preferences',
    icon: 'Settings',
    path: '/settings'
  }
];

export const getRouteById = (id: string): RouteConfig | undefined => {
  return routes.find(route => route.id === id);
};

export const getRouteTitle = (id: string): string => {
  const route = getRouteById(id);
  return route?.title || 'Dashboard';
};

export const getRouteDescription = (id: string): string => {
  const route = getRouteById(id);
  return route?.description || 'Dashboard';
};
