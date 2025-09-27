import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

interface PlatformMetric {
  module: string;
  users: number;
  sessions: number;
  avgDuration: string;
  engagement: string;
}

interface PlatformMetricsProps {
  metrics: PlatformMetric[];
}

export const PlatformMetrics: React.FC<PlatformMetricsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Usage</CardTitle>
        <CardDescription>User engagement across platform modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-chart-3" />
                <div>
                  <p className="font-medium text-sm">{metric.module}</p>
                  <p className="text-xs text-muted-foreground">{metric.users.toLocaleString()} users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{metric.sessions.toLocaleString()} sessions</p>
                <p className="text-xs text-muted-foreground">{metric.avgDuration} avg duration</p>
                <p className="text-xs text-muted-foreground">{metric.engagement} engagement</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
