import React from 'react';
import { Button } from '@/shared/components/ui';
import { Plus, Search, Filter } from 'lucide-react';

interface ERPHeaderProps {
  onAddEmployee?: () => void;
  onAddProject?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
}

export const ERPHeader: React.FC<ERPHeaderProps> = ({
  onAddEmployee,
  onAddProject,
  onSearch,
  onFilter
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">ERP Management</h1>
        <p className="text-muted-foreground">Enterprise Resource Planning System</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={onFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" onClick={onAddEmployee}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
        <Button onClick={onAddProject}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
    </div>
  );
};
