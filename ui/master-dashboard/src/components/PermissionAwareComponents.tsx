import React from 'react';
import { usePermissions, useRole } from '../hooks/usePermissions';
import { PermissionGuard, MarketplaceDeveloperGuard, TenantGuard, DeveloperGuard, CustomerGuard } from './auth/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '../shared/components/ui/card';
import { Button } from '../shared/components/ui/button';
import { Badge } from '../shared/components/ui/badge';
// Icons are imported as needed in individual components

// Re-export PermissionGuard for use in other components
export { PermissionGuard };

// Permission-aware feature cards
export const FeatureCard: React.FC<{
  feature: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children?: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  title, 
  description, 
  icon: Icon, 
  children, 
  requireFullAccess = false,
  requireLimitedAccess = false 
}) => {
  const { getPermissionLevel } = usePermissions();
  const permissionLevel = getPermissionLevel(feature as any);
  

  return (
    <PermissionGuard 
      feature={feature} 
      requireFullAccess={requireFullAccess}
      requireLimitedAccess={requireLimitedAccess}
      fallback={
        <Card className="opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-muted-foreground">{title}</CardTitle>
              </div>
              <Badge variant="secondary">No Access</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Contact your administrator for access to this feature.
            </p>
          </CardContent>
        </Card>
      }
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </div>
            <Badge variant={permissionLevel === 'full' ? 'default' : 'secondary'}>
              {permissionLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          {children}
        </CardContent>
      </Card>
    </PermissionGuard>
  );
};

// Permission-aware action buttons
export const PermissionButton: React.FC<{
  feature: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ 
  feature, 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  requireFullAccess = false,
  requireLimitedAccess = false,
  disabled = false,
  className = ''
}) => {
  const { canAccess, canAccessFull, canAccessLimited } = usePermissions();
  
  const hasAccess = () => {
    if (requireFullAccess) return canAccessFull(feature as any);
    if (requireLimitedAccess) return canAccessLimited(feature as any);
    return canAccess(feature as any);
  };

  if (!hasAccess()) {
    return (
      <Button 
        variant="outline" 
        size={size}
        disabled
        className={`opacity-50 cursor-not-allowed ${className}`}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

// Permission-aware navigation items
export const PermissionNavItem: React.FC<{
  feature: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  children, 
  href, 
  onClick, 
  className = '',
  requireFullAccess = false,
  requireLimitedAccess = false
}) => {
  const { canAccess, canAccessFull, canAccessLimited } = usePermissions();
  
  const hasAccess = () => {
    if (requireFullAccess) return canAccessFull(feature as any);
    if (requireLimitedAccess) return canAccessLimited(feature as any);
    return canAccess(feature as any);
  };

  if (!hasAccess()) {
    return null;
  }

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

// Permission-aware data display
export const PermissionData: React.FC<{
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  children, 
  fallback = <div className="text-muted-foreground">No data available</div>,
  requireFullAccess = false,
  requireLimitedAccess = false
}) => {
  return (
    <PermissionGuard 
      feature={feature}
      requireFullAccess={requireFullAccess}
      requireLimitedAccess={requireLimitedAccess}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

// Role-specific content sections
export const RoleBasedContent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isPlatformRole, isTenantRole, isDeveloper, isEndCustomer } = useRole();
  
  if (isPlatformRole()) {
    return <MarketplaceDeveloperGuard fallback={fallback}>{children}</MarketplaceDeveloperGuard>;
  }
  
  if (isTenantRole()) {
    return <TenantGuard fallback={fallback}>{children}</TenantGuard>;
  }
  
  if (isDeveloper()) {
    return <DeveloperGuard fallback={fallback}>{children}</DeveloperGuard>;
  }
  
  if (isEndCustomer()) {
    return <CustomerGuard fallback={fallback}>{children}</CustomerGuard>;
  }
  
  return <>{fallback}</>;
};

// Permission-aware dashboard widgets
export const DashboardWidget: React.FC<{
  feature: string;
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  title, 
  icon: Icon, 
  children, 
  requireFullAccess = false,
  requireLimitedAccess = false 
}) => {
  const { getPermissionLevel } = usePermissions();
  const permissionLevel = getPermissionLevel(feature as any);
  
  return (
    <PermissionGuard 
      feature={feature}
      requireFullAccess={requireFullAccess}
      requireLimitedAccess={requireLimitedAccess}
      fallback={
        <Card className="opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">No access to this widget</p>
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">{title}</CardTitle>
            </div>
            <Badge variant={permissionLevel === 'full' ? 'default' : 'secondary'} className="text-xs">
              {permissionLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </PermissionGuard>
  );
};

// Permission-aware form fields
export const PermissionFormField: React.FC<{
  feature: string;
  children: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  children, 
  requireFullAccess = false,
  requireLimitedAccess = false 
}) => {
  return (
    <PermissionGuard 
      feature={feature}
      requireFullAccess={requireFullAccess}
      requireLimitedAccess={requireLimitedAccess}
      fallback={<div className="opacity-50 pointer-events-none">{children}</div>}
    >
      {children}
    </PermissionGuard>
  );
};

// Permission-aware table header columns
export const PermissionTableHeader: React.FC<{
  feature: string;
  children: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  children, 
  requireFullAccess = false,
  requireLimitedAccess = false 
}) => {
  return (
    <PermissionGuard 
      feature={feature}
      requireFullAccess={requireFullAccess}
      requireLimitedAccess={requireLimitedAccess}
      fallback={<th className="opacity-50">{children}</th>}
    >
      {children}
    </PermissionGuard>
  );
};

// Permission-aware table body columns
export const PermissionTableColumn: React.FC<{
  feature: string;
  children: React.ReactNode;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}> = ({ 
  feature, 
  children, 
  requireFullAccess = false,
  requireLimitedAccess = false 
}) => {
  return (
    <PermissionGuard 
      feature={feature}
      requireFullAccess={requireFullAccess}
      requireLimitedAccess={requireLimitedAccess}
      fallback={<td className="opacity-50">{children}</td>}
    >
      {children}
    </PermissionGuard>
  );
};
