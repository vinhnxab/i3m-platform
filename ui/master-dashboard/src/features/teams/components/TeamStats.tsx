import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { LucideIcon } from 'lucide-react';

interface TeamStat {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface TeamStatsProps {
  stats: TeamStat[];
  className?: string;
}

export function TeamStats({ stats, className = "" }: TeamStatsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
