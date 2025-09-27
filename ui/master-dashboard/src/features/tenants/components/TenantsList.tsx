import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Search, Filter, MoreHorizontal, Eye, Edit, Ban } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  users: number;
  maxUsers: number;
  storage: number;
  maxStorage: number;
  createdAt: string;
  lastLogin: string;
  owner: string;
  billing: {
    monthlyRevenue: number;
    totalRevenue: number;
    nextBilling: string;
    paymentMethod: string;
  };
  features: string[];
  health: 'excellent' | 'good' | 'warning' | 'critical';
}

interface TenantsListProps {
  tenants: Tenant[];
  onViewTenant?: (tenant: Tenant) => void;
  onEditTenant?: (tenant: Tenant) => void;
  onSuspendTenant?: (tenant: Tenant) => void;
  className?: string;
}

export function TenantsList({ 
  tenants, 
  onViewTenant, 
  onEditTenant, 
  onSuspendTenant,
  className = "" 
}: TenantsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>Manage your platform tenants</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {tenant.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">{tenant.domain}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                    <Badge variant="outline">{tenant.plan}</Badge>
                    <span className={`text-xs ${getHealthColor(tenant.health)}`}>
                      {tenant.health}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${tenant.billing.monthlyRevenue.toLocaleString()}/mo</p>
                <p className="text-xs text-muted-foreground">
                  {tenant.users}/{tenant.maxUsers} users
                </p>
                <p className="text-xs text-muted-foreground">
                  {tenant.storage}GB/{tenant.maxStorage}GB storage
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onViewTenant?.(tenant)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditTenant?.(tenant)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onSuspendTenant?.(tenant)}>
                  <Ban className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
