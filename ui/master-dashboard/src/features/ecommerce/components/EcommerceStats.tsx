import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';

interface EcommerceStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  trend: 'up' | 'down';
}

interface EcommerceStatsProps {
  stats: EcommerceStat[];
}

export const EcommerceStats: React.FC<EcommerceStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`h-4 w-4 ${stat.color}`}>
              {/* Icon would be rendered here based on stat.icon */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`inline-flex items-center ${stat.change.startsWith('+') ? 'text-chart-2' : 'text-chart-4'}`}>
                {stat.change}
              </span>
              <span className="ml-2">from last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
