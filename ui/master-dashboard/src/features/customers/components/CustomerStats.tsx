import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { LucideIcon } from 'lucide-react';

interface CustomerStat {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface CustomerStatsProps {
  stats: CustomerStat[];
  className?: string;
}

export function CustomerStats({ stats, className = "" }: CustomerStatsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground tracking-tight mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground font-medium">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
