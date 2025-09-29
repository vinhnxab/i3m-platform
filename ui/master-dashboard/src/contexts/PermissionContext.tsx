import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';

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

// Permission state interface
interface PermissionState {
  permissions: string[];
  customPermissions: string[];
  resourcePermissions: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
}

// Permission actions
type PermissionAction = 
  | { type: 'SET_PERMISSIONS'; payload: string[] }
  | { type: 'SET_CUSTOM_PERMISSIONS'; payload: string[] }
  | { type: 'SET_RESOURCE_PERMISSIONS'; payload: Record<string, string[]> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_PERMISSIONS' };

// Permission context interface
interface PermissionContextType {
  state: PermissionState;
  hasPermission: (permission: string) => boolean;
  hasResourcePermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessResource: (resource: string, context?: { tenantId?: string; userId?: string }) => boolean;
  getPermissionLevel: (resource: string) => string;
  refreshPermissions: () => void;
}

// Permission reducer
const permissionReducer = (state: PermissionState, action: PermissionAction): PermissionState => {
  switch (action.type) {
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    case 'SET_CUSTOM_PERMISSIONS':
      return { ...state, customPermissions: action.payload };
    case 'SET_RESOURCE_PERMISSIONS':
      return { ...state, resourcePermissions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_PERMISSIONS':
      return {
        permissions: [],
        customPermissions: [],
        resourcePermissions: {},
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

// Initial state
const initialState: PermissionState = {
  permissions: [],
  customPermissions: [],
  resourcePermissions: {},
  isLoading: false,
  error: null
};

// Create context
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// Permission provider component
export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [state, dispatch] = useReducer(permissionReducer, initialState);

  // Resource permissions mapping
  const RESOURCE_PERMISSIONS = {
    'users.create': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'users.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER'],
    'users.update': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'users.delete': ['MANAGEMENT_ADMIN'],
    'users.manage': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'customers.create': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER'],
    'customers.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER'],
    'customers.update': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER'],
    'customers.delete': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'customers.manage': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN'],
    'tenants.create': ['MANAGEMENT_ADMIN'],
    'tenants.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER'],
    'tenants.update': ['MANAGEMENT_ADMIN'],
    'tenants.delete': ['MANAGEMENT_ADMIN'],
    'tenants.manage': ['MANAGEMENT_ADMIN'],
    'api.create': ['MANAGEMENT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'api.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
    'api.update': ['MANAGEMENT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'api.delete': ['MANAGEMENT_ADMIN'],
    'api.manage': ['MANAGEMENT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'analytics.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'analytics.export': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'analytics.manage': ['MANAGEMENT_ADMIN'],
    'security.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'security.update': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'security.manage': ['MANAGEMENT_ADMIN'],
    'settings.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'settings.update': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'settings.manage': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'backup.read': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'backup.create': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'backup.restore': ['MANAGEMENT_ADMIN'],
    'backup.manage': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'teams.create': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'teams.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
    'teams.update': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'teams.delete': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'teams.manage': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'content.create': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'content.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'content.update': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
    'content.delete': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'content.manage': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'ecommerce.create': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'ecommerce.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'ecommerce.update': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
    'ecommerce.delete': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'ecommerce.manage': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'MARKETPLACE_DEVELOPER'],
    'support.create': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'support.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'support.update': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
    'support.delete': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'support.manage': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN'],
    'chat.create': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'chat.read': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER', 'TENANT_CUSTOMER'],
    'chat.update': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN', 'TENANT_USER', 'MARKETPLACE_DEVELOPER'],
    'chat.delete': ['MANAGEMENT_ADMIN', 'TENANT_ADMIN'],
    'chat.manage': ['MANAGEMENT_ADMIN', 'MANAGEMENT_USER', 'TENANT_ADMIN']
  };

  // Load permissions when user changes
  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Get role-based permissions
        const rolePermissions: string[] = [];
        Object.entries(RESOURCE_PERMISSIONS).forEach(([permission, roles]) => {
          if (roles.includes(user.role)) {
            rolePermissions.push(permission);
          }
        });
        
        dispatch({ type: 'SET_PERMISSIONS', payload: rolePermissions });
        dispatch({ type: 'SET_CUSTOM_PERMISSIONS', payload: user.customPermissions || [] });
        dispatch({ type: 'SET_RESOURCE_PERMISSIONS', payload: RESOURCE_PERMISSIONS });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load permissions' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'RESET_PERMISSIONS' });
    }
  }, [user]);

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return state.permissions.includes(permission) || state.customPermissions.includes(permission);
  };

  const hasResourcePermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    const permission = `${resource}.${action}`;
    const allowedRoles = RESOURCE_PERMISSIONS[permission as keyof typeof RESOURCE_PERMISSIONS];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessResource = (resource: string, context?: { tenantId?: string; userId?: string }): boolean => {
    if (!user) return false;
    
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
    
    return hasResourcePermission(resource, 'read');
  };

  const getPermissionLevel = (resource: string): string => {
    if (!user) return 'none';
    
    if (hasResourcePermission(resource, 'manage')) return 'manage';
    if (hasResourcePermission(resource, 'delete')) return 'delete';
    if (hasResourcePermission(resource, 'update')) return 'update';
    if (hasResourcePermission(resource, 'create')) return 'create';
    if (hasResourcePermission(resource, 'read')) return 'read';
    
    return 'none';
  };

  const refreshPermissions = () => {
    if (user) {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const rolePermissions: string[] = [];
        Object.entries(RESOURCE_PERMISSIONS).forEach(([permission, roles]) => {
          if (roles.includes(user.role)) {
            rolePermissions.push(permission);
          }
        });
        
        dispatch({ type: 'SET_PERMISSIONS', payload: rolePermissions });
        dispatch({ type: 'SET_CUSTOM_PERMISSIONS', payload: user.customPermissions || [] });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh permissions' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const contextValue: PermissionContextType = {
    state,
    hasPermission,
    hasResourcePermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessResource,
    getPermissionLevel,
    refreshPermissions
  };

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook to use permission context
export const usePermissionContext = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
