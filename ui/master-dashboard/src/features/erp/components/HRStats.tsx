import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { motion } from 'motion/react';
import { Users, UserPlus, UserMinus, Clock } from 'lucide-react';

interface HRStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface HRStatsProps {
  stats: HRStat[];
}

export const HRStats: React.FC<HRStatsProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Statistics</CardTitle>
        <CardDescription>Human resources metrics and insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={`h-8 w-8 ${stat.color} rounded-full flex items-center justify-center`}>
                    {/* Icon would be rendered here based on stat.icon */}
                  </div>
                </div>
                <h3 className="font-medium text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-chart-2' : 'text-chart-4'}>
                    {stat.change}
                  </span>
                  from last month
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
