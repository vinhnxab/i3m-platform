import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { StatusIndicator } from '@/shared/components/dashboard';
import { Zap } from 'lucide-react';

interface SystemStatusData {
  service: string;
  status: 'operational' | 'maintenance' | 'error';
  uptime: string;
}

interface SystemStatusProps {
  services: SystemStatusData[];
  title?: string;
  description?: string;
  className?: string;
}

export function SystemStatus({ 
  services, 
  title = "System Status",
  description = "Real-time system health monitoring",
  className = ""
}: SystemStatusProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-chart-2" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((status, index) => (
          <StatusIndicator
            key={status.service}
            status={status.status}
            service={status.service}
            uptime={status.uptime}
          />
        ))}
      </CardContent>
    </Card>
  );
}
