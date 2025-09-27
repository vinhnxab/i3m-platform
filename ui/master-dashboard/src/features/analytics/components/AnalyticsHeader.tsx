import React from 'react';
import { Button } from '@/shared/components/ui';
import { Filter, Download, RefreshCw } from 'lucide-react';

interface AnalyticsHeaderProps {
  onFilter?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onFilter,
  onExport,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Comprehensive platform analytics and insights</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
