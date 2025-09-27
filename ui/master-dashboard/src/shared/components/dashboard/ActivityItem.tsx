interface ActivityItemProps {
  type: 'customer' | 'order' | 'support' | 'system';
  action: string;
  customer: string;
  time: string;
}

export function ActivityItem({ type, action, customer, time }: ActivityItemProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-chart-2';
      case 'order':
        return 'bg-chart-3';
      case 'support':
        return 'bg-chart-4';
      case 'system':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(type)}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{action}</p>
        <p className="text-xs text-muted-foreground">{customer}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
