import React from 'react';
import { usePermissions, useRole } from '@/hooks/usePermissions';
import { PERMISSION_LEVELS } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  feature,
  children,
  fallback = null,
  requireFullAccess = false,
  requireLimitedAccess = false
}) => {
  const { canAccess, canAccessFull, canAccessLimited } = usePermissions();

  // Check if user has access to the feature
  if (!canAccess(feature as any)) {
    return <>{fallback}</>;
  }

  // Check for specific access requirements
  if (requireFullAccess && !canAccessFull(feature as any)) {
    return <>{fallback}</>;
  }

  if (requireLimitedAccess && !canAccessLimited(feature as any)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Higher-order component for permission-based rendering
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  feature: string,
  options?: {
    requireFullAccess?: boolean;
    requireLimitedAccess?: boolean;
    fallback?: React.ReactNode;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <PermissionGuard
        feature={feature}
        requireFullAccess={options?.requireFullAccess}
        requireLimitedAccess={options?.requireLimitedAccess}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </PermissionGuard>
    );
  };

  WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Component for showing permission-based content
export const PermissionContent: React.FC<{
  feature: string;
  fullAccess?: React.ReactNode;
  limitedAccess?: React.ReactNode;
  noAccess?: React.ReactNode;
}> = ({ feature, fullAccess, limitedAccess, noAccess }) => {
  const { getPermissionLevel } = usePermissions();
  const permissionLevel = getPermissionLevel(feature as any);

  switch (permissionLevel) {
    case PERMISSION_LEVELS.FULL:
      return <>{fullAccess}</>;
    case PERMISSION_LEVELS.LIMITED:
      return <>{limitedAccess}</>;
    case PERMISSION_LEVELS.NONE:
    default:
      return <>{noAccess}</>;
  }
};

// Component for conditional rendering based on role
export const RoleGuard: React.FC<{
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ roles, children, fallback = null }) => {
  const { hasAnyRole } = useRole();
  
  if (!hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component for platform-specific content
export const PlatformGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isPlatformRole } = useRole();
  
  if (!isPlatformRole()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component for tenant-specific content
export const TenantGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isTenantRole } = useRole();
  
  if (!isTenantRole()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component for developer-specific content
export const DeveloperGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isDeveloper } = useRole();
  
  if (!isDeveloper()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component for customer-specific content
export const CustomerGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isEndCustomer } = useRole();
  
  if (!isEndCustomer()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
