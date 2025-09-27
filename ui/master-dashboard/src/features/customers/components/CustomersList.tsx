import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { Search, Filter } from 'lucide-react';
import { CustomerCard } from './CustomerCard';

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

interface CustomersListProps {
  customers: Customer[];
  onViewCustomer?: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onMoreCustomer?: (customer: Customer) => void;
  onSearch?: () => void;
  onFilter?: () => void;
  className?: string;
}

export function CustomersList({ 
  customers, 
  onViewCustomer, 
  onEditCustomer, 
  onMoreCustomer,
  onSearch, 
  onFilter,
  className = ""
}: CustomersListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Manage your customer relationships</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={onFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onView={onViewCustomer}
              onEdit={onEditCustomer}
              onMore={onMoreCustomer}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
