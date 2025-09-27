import { useSelector } from 'react-redux';
import { usePermissions } from './usePermissions';

interface RootState {
  auth: {
    user: {
      role: string;
      userRoles?: string[];
      tenantId?: string;
      permissions?: string[];
      customPermissions?: string[];
    } | null;
  };
}

// Advanced permission types
export const PERMISSION_TYPES = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
  EXECUTE: 'execute',
  MANAGE: 'manage'
} as const;

// Resource-based permissions
export const RESOURCE_PERMISSIONS = {
  // User management permissions
  'users.create': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'users.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER'],
  'users.update': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'users.delete': ['PLATFORM_ADMIN'],
  'users.manage': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],

  // Customer management permissions
  'customers.create': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER'],
  'customers.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER'],
  'customers.update': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER'],
  'customers.delete': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'customers.manage': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN'],

  // Tenant management permissions
  'tenants.create': ['PLATFORM_ADMIN'],
  'tenants.read': ['PLATFORM_ADMIN', 'PLATFORM_USER'],
  'tenants.update': ['PLATFORM_ADMIN'],
  'tenants.delete': ['PLATFORM_ADMIN'],
  'tenants.manage': ['PLATFORM_ADMIN'],

  // API management permissions
  'api.create': ['PLATFORM_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'api.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
  'api.update': ['PLATFORM_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'api.delete': ['PLATFORM_ADMIN'],
  'api.manage': ['PLATFORM_ADMIN', 'MARKETPLACE_DEVELOPER'],

  // Analytics permissions
  'analytics.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'analytics.export': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'analytics.manage': ['PLATFORM_ADMIN'],

  // Security permissions
  'security.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'security.update': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'security.manage': ['PLATFORM_ADMIN'],

  // Settings permissions
  'settings.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'settings.update': ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'settings.manage': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],

  // Backup permissions
  'backup.read': ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'backup.create': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'backup.restore': ['PLATFORM_ADMIN'],
  'backup.manage': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],

  // Team management permissions
  'teams.create': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'teams.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
  'teams.update': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'teams.delete': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'teams.manage': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],

  // Content management permissions
  'content.create': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'content.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'content.update': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
  'content.delete': ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'content.manage': ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],

  // E-commerce permissions
  'ecommerce.create': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'ecommerce.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'ecommerce.update': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
  'ecommerce.delete': ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
  'ecommerce.manage': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],

  // Support permissions
  'support.create': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'support.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'support.update': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
  'support.delete': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'support.manage': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN'],

  // Live chat permissions
  'chat.create': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'chat.read': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'END_CUSTOMER'],
  'chat.update': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
  'chat.delete': ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  'chat.manage': ['PLATFORM_ADMIN', 'PLATFORM_USER', 'TENANT_ADMIN']
} as const;

// Advanced permission hooks
export const useAdvancedPermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { canAccess, getPermissionLevel } = usePermissions();

  // Check if user has specific resource permission
  const hasResourcePermission = (resource: string, action: string = 'read'): boolean => {
    if (!isAuthenticated || !user) return false;
    
    const permission = `${resource}.${action}`;
    const allowedRoles = RESOURCE_PERMISSIONS[permission as keyof typeof RESOURCE_PERMISSIONS];
    
    if (!allowedRoles) return false;
    
    return allowedRoles.includes(user.role);
  };

  // Check if user can perform action on resource
  const canPerformAction = (resource: string, action: string): boolean => {
    return hasResourcePermission(resource, action);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    
    return permissions.some(permission => {
      const [resource, action] = permission.split('.');
      return hasResourcePermission(resource, action);
    });
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    
    return permissions.every(permission => {
      const [resource, action] = permission.split('.');
      return hasResourcePermission(resource, action);
    });
  };

  // Check if user can access resource with specific context
  const canAccessResource = (resource: string, context?: { tenantId?: string; userId?: string }): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Platform admins can access everything
    if (user.role === 'PLATFORM_ADMIN') return true;
    
    // Check tenant-specific access
    if (context?.tenantId && user.tenantId && context.tenantId !== user.tenantId) {
      return false;
    }
    
    // Check user-specific access
    if (context?.userId && user.id && context.userId !== user.id) {
      return false;
    }
    
    return hasResourcePermission(resource);
  };

  // Check if user can manage resource
  const canManageResource = (resource: string): boolean => {
    return hasResourcePermission(resource, 'manage');
  };

  // Check if user can create resource
  const canCreateResource = (resource: string): boolean => {
    return hasResourcePermission(resource, 'create');
  };

  // Check if user can update resource
  const canUpdateResource = (resource: string): boolean => {
    return hasResourcePermission(resource, 'update');
  };

  // Check if user can delete resource
  const canDeleteResource = (resource: string): boolean => {
    return hasResourcePermission(resource, 'delete');
  };

  // Get user's effective permissions
  const getUserPermissions = (): string[] => {
    if (!isAuthenticated || !user) return [];
    
    const permissions: string[] = [];
    
    // Add role-based permissions
    Object.entries(RESOURCE_PERMISSIONS).forEach(([permission, roles]) => {
      if (roles.includes(user.role)) {
        permissions.push(permission);
      }
    });
    
    // Add custom permissions if any
    if (user.customPermissions) {
      permissions.push(...user.customPermissions);
    }
    
    return permissions;
  };

  // Check if user has custom permission
  const hasCustomPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    return user.customPermissions?.includes(permission) || false;
  };

  // Check if user can access feature with specific requirements
  const canAccessFeatureWithRequirements = (feature: string, requirements?: {
    tenantId?: string;
    userId?: string;
    customPermissions?: string[];
  }): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Check basic feature access
    if (!canAccess(feature as any)) return false;
    
    // Check tenant requirements
    if (requirements?.tenantId && user.tenantId && requirements.tenantId !== user.tenantId) {
      return false;
    }
    
    // Check user requirements
    if (requirements?.userId && user.id && requirements.userId !== user.id) {
      return false;
    }
    
    // Check custom permissions
    if (requirements?.customPermissions) {
      return requirements.customPermissions.every(permission => hasCustomPermission(permission));
    }
    
    return true;
  };

  // Get permission level for resource
  const getResourcePermissionLevel = (resource: string): string => {
    if (!isAuthenticated || !user) return 'none';
    
    if (hasResourcePermission(resource, 'manage')) return 'manage';
    if (hasResourcePermission(resource, 'delete')) return 'delete';
    if (hasResourcePermission(resource, 'update')) return 'update';
    if (hasResourcePermission(resource, 'create')) return 'create';
    if (hasResourcePermission(resource, 'read')) return 'read';
    
    return 'none';
  };

  // Check if user can access data with filters
  const canAccessDataWithFilters = (resource: string, filters?: {
    tenantId?: string;
    userId?: string;
    dateRange?: { start: Date; end: Date };
    customFilters?: Record<string, any>;
  }): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Check basic resource access
    if (!hasResourcePermission(resource)) return false;
    
    // Check tenant filter
    if (filters?.tenantId && user.tenantId && filters.tenantId !== user.tenantId) {
      return false;
    }
    
    // Check user filter
    if (filters?.userId && user.id && filters.userId !== user.id) {
      return false;
    }
    
    // Platform admins can access all data
    if (user.role === 'PLATFORM_ADMIN') return true;
    
    // Tenant admins can access their tenant's data
    if (user.role === 'TENANT_ADMIN' && user.tenantId) {
      return !filters?.tenantId || filters.tenantId === user.tenantId;
    }
    
    // Regular users can only access their own data
    if (user.role === 'TENANT_USER' || user.role === 'END_CUSTOMER') {
      return !filters?.userId || filters.userId === user.id;
    }
    
    return true;
  };

  return {
    hasResourcePermission,
    canPerformAction,
    hasAnyPermission,
    hasAllPermissions,
    canAccessResource,
    canManageResource,
    canCreateResource,
    canUpdateResource,
    canDeleteResource,
    getUserPermissions,
    hasCustomPermission,
    canAccessFeatureWithRequirements,
    getResourcePermissionLevel,
    canAccessDataWithFilters,
    user,
    isAuthenticated
  };
};
