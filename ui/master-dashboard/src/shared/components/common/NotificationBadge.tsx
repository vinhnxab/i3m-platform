interface NotificationBadgeProps {
  count: number;
  isMobile?: boolean;
  color?: 'primary' | 'green' | 'red' | 'orange';
  className?: string;
}

export function NotificationBadge({ 
  count, 
  isMobile = false, 
  color = 'primary',
  className = ""
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  const colorClasses = {
    primary: 'bg-primary',
    green: 'bg-chart-2',
    red: 'bg-chart-4', 
    orange: 'bg-chart-3'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <div className={`
      absolute -top-1 -right-1 
      ${isMobile ? 'w-4 h-4 text-[10px]' : 'w-5 h-5 text-xs'} 
      ${colorClasses[color]} 
      text-white rounded-full flex items-center justify-center font-semibold
      shadow-lg border-2 border-background
      ${className}
    `}>
      {displayCount}
    </div>
  );
}
