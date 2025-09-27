import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

interface CustomerMetric {
  segment: string;
  customers: number;
  revenue: string;
  growth: string;
  retention: string;
}

interface CustomerMetricsProps {
  metrics: CustomerMetric[];
}

export const CustomerMetrics: React.FC<CustomerMetricsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segments</CardTitle>
        <CardDescription>Performance by customer segment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <div>
                  <p className="font-medium text-sm">{metric.segment}</p>
                  <p className="text-xs text-muted-foreground">{metric.customers.toLocaleString()} customers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{metric.revenue}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-chart-2">{metric.growth}</span> growth
                </p>
                <p className="text-xs text-muted-foreground">{metric.retention} retention</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
