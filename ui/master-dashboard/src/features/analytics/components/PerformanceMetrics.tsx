import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/shared/components/ui';

interface PerformanceMetric {
  metric: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'critical' | 'excellent';
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-chart-2';
      case 'good': return 'bg-chart-1';
      case 'warning': return 'bg-chart-3';
      case 'critical': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>System performance and reliability indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)}`} />
                <div>
                  <p className="font-medium text-sm">{metric.metric}</p>
                  <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{metric.value}</p>
                <Badge variant="outline" className="capitalize">{metric.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
