// Router types and interfaces
export type RouteId = 
  | 'overview'
  | 'erp'
  | 'cms'
  | 'ecommerce'
  | 'support'
  | 'templates'
  | 'services'
  | 'analytics'
  | 'customers'
  | 'aiml'
  | 'workflow'
  | 'security'
  | 'performance'
  | 'backup'
  | 'api'
  | 'scrum'
  | 'settings';

export interface RouteConfig {
  id: RouteId;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  path: string;
}

export interface NavigationState {
  activeSection: RouteId;
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  isTransitioning: boolean;
}
