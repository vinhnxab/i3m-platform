import React from 'react';
import { Button } from '@/shared/components/ui';
import { Plus, TrendingUp } from 'lucide-react';

interface EcommerceHeaderProps {
  onAddProduct?: () => void;
  onViewAnalytics?: () => void;
}

export const EcommerceHeader: React.FC<EcommerceHeaderProps> = ({
  onAddProduct,
  onViewAnalytics
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">E-commerce Management</h1>
        <p className="text-muted-foreground">Multi-channel commerce dashboard</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
        <Button onClick={onViewAnalytics}>
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
};
