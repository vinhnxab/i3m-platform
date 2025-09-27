import { Card, CardContent } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import { Building2, Mail, Phone, Eye, Edit, MoreHorizontal } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  industry: string;
  size: 'Startup' | 'SME' | 'Enterprise';
  employees: number;
  plan: string;
  mrr: string;
  status: 'active' | 'inactive' | 'trial' | 'churned';
  health: 'excellent' | 'good' | 'warning' | 'critical';
  lastLogin: string;
  joinDate: string;
  contact: string;
  phone: string;
  usage: number;
}

interface CustomerCardProps {
  customer: Customer;
  onView?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onMore?: (customer: Customer) => void;
  className?: string;
}

export function CustomerCard({ customer, onView, onEdit, onMore, className = "" }: CustomerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'churned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{customer.name}</h4>
                <Badge variant="outline" className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
                <Badge variant="outline" className={getHealthColor(customer.health)}>
                  {customer.health}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{customer.industry} • {customer.size}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{customer.employees} employees</span>
                <span>MRR: {customer.mrr}</span>
                <span>Usage: {customer.usage}%</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{customer.contact}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView?.(customer)}
              className="p-2 hover:bg-muted rounded-lg"
              title="View Customer"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit?.(customer)}
              className="p-2 hover:bg-muted rounded-lg"
              title="Edit Customer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMore?.(customer)}
              className="p-2 hover:bg-muted rounded-lg"
              title="More Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
