import { StatCard } from '@/shared/components/dashboard';
import { LucideIcon } from 'lucide-react';

interface StatData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface StatsGridProps {
  stats: StatData[];
  className?: string;
}

export function StatsGrid({ stats, className = "" }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
