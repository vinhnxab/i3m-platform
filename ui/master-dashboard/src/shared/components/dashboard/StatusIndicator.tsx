import { Badge } from '@/shared/components/ui';

interface StatusIndicatorProps {
  status: 'operational' | 'maintenance' | 'error';
  service: string;
  uptime: string;
}

export function StatusIndicator({ status, service, uptime }: StatusIndicatorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-chart-2';
      case 'maintenance':
        return 'bg-chart-3';
      case 'error':
        return 'bg-chart-4';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        <div>
          <p className="font-medium text-sm">{service}</p>
          <p className="text-xs text-muted-foreground capitalize">{status}</p>
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        {uptime}
      </Badge>
    </div>
  );
}
