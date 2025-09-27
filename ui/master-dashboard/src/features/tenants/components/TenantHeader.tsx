import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { Plus, Search, Filter, Download } from 'lucide-react';

interface TenantHeaderProps {
  onNewTenant?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  className?: string;
}

export function TenantHeader({ 
  onNewTenant, 
  onSearch, 
  onFilter, 
  onExport,
  className = "" 
}: TenantHeaderProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Tenant Management</span>
            </CardTitle>
            <CardDescription>
              Manage tenants, billing, and platform access
            </CardDescription>
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
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={onNewTenant}>
              <Plus className="w-4 h-4 mr-2" />
              New Tenant
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
