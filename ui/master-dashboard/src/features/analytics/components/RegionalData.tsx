import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

interface RegionalData {
  region: string;
  users: number;
  revenue: string;
  growth: string;
  share: string;
}

interface RegionalDataProps {
  data: RegionalData[];
}

export const RegionalData: React.FC<RegionalDataProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Performance</CardTitle>
        <CardDescription>User distribution and revenue by region</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((region, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-chart-4" />
                <div>
                  <p className="font-medium text-sm">{region.region}</p>
                  <p className="text-xs text-muted-foreground">{region.users.toLocaleString()} users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{region.revenue}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-chart-2">{region.growth}</span> growth
                </p>
                <p className="text-xs text-muted-foreground">{region.share} market share</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
