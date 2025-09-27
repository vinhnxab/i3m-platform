import React from 'react';
import { useAdvancedPermissions } from '@/hooks/useAdvancedPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  Building,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Plus,
  Download,
  Upload,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Advanced permission guard with resource and action
export const ResourcePermissionGuard: React.FC<{
  resource: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: { tenantId?: string; userId?: string };
}> = ({ resource, action = 'read', children, fallback = null, context }) => {
  const { hasResourcePermission, canAccessResource } = useAdvancedPermissions();
  
  const hasPermission = context 
    ? canAccessResource(resource, context)
    : hasResourcePermission(resource, action);
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Resource action button with permission checking
export const ResourceActionButton: React.FC<{
  resource: string;
  action: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  context?: { tenantId?: string; userId?: string };
}> = ({ 
  resource, 
  action, 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  context
}) => {
  const { hasResourcePermission, canAccessResource } = useAdvancedPermissions();
  
  const hasPermission = context 
    ? canAccessResource(resource, context)
    : hasResourcePermission(resource, action);
  
  if (!hasPermission) {
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

// Resource management card with permission-based actions
export const ResourceManagementCard: React.FC<{
  resource: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children?: React.ReactNode;
  context?: { tenantId?: string; userId?: string };
}> = ({ 
  resource, 
  title, 
  description, 
  icon: Icon, 
  children, 
  context 
}) => {
  const { 
    canCreateResource, 
    canUpdateResource, 
    canDeleteResource, 
    canManageResource,
    getResourcePermissionLevel 
  } = useAdvancedPermissions();
  
  const permissionLevel = getResourcePermissionLevel(resource);
  const canCreate = canCreateResource(resource);
  const canUpdate = canUpdateResource(resource);
  const canDelete = canDeleteResource(resource);
  const canManage = canManageResource(resource);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Badge variant={permissionLevel === 'manage' ? 'default' : 'secondary'}>
            {permissionLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
        
        <div className="flex space-x-2 mt-4">
          <ResourceActionButton 
            resource={resource} 
            action="create" 
            variant="outline" 
            size="sm"
            context={context}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </ResourceActionButton>
          
          <ResourceActionButton 
            resource={resource} 
            action="update" 
            variant="outline" 
            size="sm"
            context={context}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </ResourceActionButton>
          
          <ResourceActionButton 
            resource={resource} 
            action="delete" 
            variant="destructive" 
            size="sm"
            context={context}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </ResourceActionButton>
          
          {canManage && (
            <ResourceActionButton 
              resource={resource} 
              action="manage" 
              variant="default" 
              size="sm"
              context={context}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </ResourceActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Permission-based data table with granular access
export const PermissionDataTable: React.FC<{
  resource: string;
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    permission?: string;
    context?: { tenantId?: string; userId?: string };
  }>;
  actions?: Array<{
    label: string;
    action: string;
    icon: React.ComponentType<any>;
    permission?: string;
    context?: { tenantId?: string; userId?: string };
  }>;
  context?: { tenantId?: string; userId?: string };
}> = ({ resource, data, columns, actions = [], context }) => {
  const { hasResourcePermission, canAccessResource } = useAdvancedPermissions();
  
  const canAccess = context 
    ? canAccessResource(resource, context)
    : hasResourcePermission(resource);
  
  if (!canAccess) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Access Denied</h3>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this resource.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <ResourcePermissionGuard
                    key={column.key}
                    resource={resource}
                    action={column.permission || 'read'}
                    context={column.context || context}
                    fallback={<th className="opacity-50">{column.label}</th>}
                  >
                    <th className="text-left p-3">{column.label}</th>
                  </ResourcePermissionGuard>
                ))}
                {actions.length > 0 && <th className="text-left p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {columns.map((column) => (
                    <ResourcePermissionGuard
                      key={column.key}
                      resource={resource}
                      action={column.permission || 'read'}
                      context={column.context || context}
                      fallback={<td className="p-3 opacity-50">—</td>}
                    >
                      <td className="p-3">
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </td>
                    </ResourcePermissionGuard>
                  ))}
                  {actions.length > 0 && (
                    <td className="p-3">
                      <div className="flex space-x-2">
                        {actions.map((action, actionIndex) => (
                          <ResourceActionButton
                            key={actionIndex}
                            resource={resource}
                            action={action.action}
                            context={action.context || context}
                            variant="outline"
                            size="sm"
                          >
                            <action.icon className="w-4 h-4" />
                          </ResourceActionButton>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Permission-based form with granular field access
export const PermissionForm: React.FC<{
  resource: string;
  children: React.ReactNode;
  onSubmit?: (data: any) => void;
  context?: { tenantId?: string; userId?: string };
}> = ({ resource, children, onSubmit, context }) => {
  const { canCreateResource, canUpdateResource, canAccessResource } = useAdvancedPermissions();
  
  const canAccess = canAccessResource(resource, context);
  const canCreate = canCreateResource(resource);
  const canUpdate = canUpdateResource(resource);
  
  if (!canAccess) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Access Denied</h3>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this form.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          
          <div className="flex space-x-2 pt-4">
            <ResourceActionButton 
              resource={resource} 
              action="create" 
              type="submit"
              context={context}
              disabled={!canCreate}
            >
              {canCreate ? 'Create' : 'No Create Permission'}
            </ResourceActionButton>
            
            <ResourceActionButton 
              resource={resource} 
              action="update" 
              type="submit"
              context={context}
              disabled={!canUpdate}
            >
              {canUpdate ? 'Update' : 'No Update Permission'}
            </ResourceActionButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Permission-based data visualization
export const PermissionDataVisualization: React.FC<{
  resource: string;
  title: string;
  children: React.ReactNode;
  context?: { tenantId?: string; userId?: string };
  filters?: {
    tenantId?: string;
    userId?: string;
    dateRange?: { start: Date; end: Date };
    customFilters?: Record<string, any>;
  };
}> = ({ resource, title, children, context, filters }) => {
  const { canAccessDataWithFilters } = useAdvancedPermissions();
  
  const canAccess = canAccessDataWithFilters(resource, filters);
  
  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Data Access Restricted</h3>
          <p className="text-sm text-muted-foreground">
            You don't have permission to view this data with the current filters.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

// Permission status indicator
export const PermissionStatus: React.FC<{
  resource: string;
  action?: string;
  context?: { tenantId?: string; userId?: string };
}> = ({ resource, action = 'read', context }) => {
  const { getResourcePermissionLevel, hasResourcePermission } = useAdvancedPermissions();
  
  const permissionLevel = getResourcePermissionLevel(resource);
  const hasPermission = hasResourcePermission(resource, action);
  
  const getStatusIcon = () => {
    if (hasPermission) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };
  
  const getStatusColor = () => {
    if (hasPermission) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };
  
  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {hasPermission ? 'Allowed' : 'Denied'}
      </span>
      <Badge variant={permissionLevel === 'manage' ? 'default' : 'secondary'}>
        {permissionLevel}
      </Badge>
    </div>
  );
};
