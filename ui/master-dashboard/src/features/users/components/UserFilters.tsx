import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  tenantFilter: string;
  tenants: string[];
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTenantFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  roleFilter,
  statusFilter,
  tenantFilter,
  tenants,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onTenantFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Role Filter */}
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
          <SelectItem value="PLATFORM_USER">Platform User</SelectItem>
          <SelectItem value="MARKETPLACE_DEVELOPER">Developer</SelectItem>
          <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
          <SelectItem value="TENANT_USER">Tenant User</SelectItem>
          <SelectItem value="END_CUSTOMER">End Customer</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Tenant Filter */}
      <Select value={tenantFilter} onValueChange={onTenantFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by tenant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tenants</SelectItem>
          {(tenants || []).map(tenant => (
            <SelectItem key={tenant} value={tenant || ''}>
              {tenant}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="flex items-center space-x-2"
      >
        <X className="w-4 h-4" />
        <span>Clear</span>
      </Button>
    </div>
  );
};
