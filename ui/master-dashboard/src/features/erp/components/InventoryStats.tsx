import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { motion } from 'motion/react';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryStat {
  item: string;
  quantity: number;
  threshold: number;
  status: 'low' | 'normal' | 'high';
  lastUpdated: string;
}

interface InventoryStatsProps {
  stats: InventoryStat[];
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ stats }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-chart-4';
      case 'normal': return 'bg-chart-2';
      case 'high': return 'bg-chart-3';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'high': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Current inventory levels and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(stat.status)}`} />
                  <div>
                    <p className="font-medium text-sm">{stat.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.quantity} units • Threshold: {stat.threshold}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(stat.status)}
                    <span className="text-sm capitalize">{stat.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Updated: {stat.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
