import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

interface ConversionFunnelProps {
  funnel: ConversionFunnel[];
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ funnel }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>User journey through the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnel.map((stage, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-chart-5" />
                <div>
                  <p className="font-medium text-sm">{stage.stage}</p>
                  <p className="text-xs text-muted-foreground">{stage.count.toLocaleString()} users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{stage.percentage}%</p>
                <p className="text-xs text-muted-foreground">conversion rate</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
