import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className={`inline-flex items-center ${change.startsWith('+') ? 'text-chart-2' : 'text-chart-4'}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {change}
          </span>
          <span className="ml-2">from last month</span>
        </p>
      </CardContent>
    </Card>
  );
}
