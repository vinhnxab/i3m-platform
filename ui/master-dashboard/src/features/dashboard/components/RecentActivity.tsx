import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { ActivityItem } from '@/shared/components/dashboard';
import { Play } from 'lucide-react';

interface ActivityData {
  type: 'customer' | 'order' | 'support' | 'system';
  action: string;
  customer: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityData[];
  title?: string;
  description?: string;
  className?: string;
}

export function RecentActivity({ 
  activities, 
  title = "Recent Activity",
  description = "Latest system events and updates",
  className = ""
}: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-chart-3" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            type={activity.type}
            action={activity.action}
            customer={activity.customer}
            time={activity.time}
          />
        ))}
      </CardContent>
    </Card>
  );
}
