import { Badge } from '@/shared/components/ui';
import { CheckCircle } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  showStatus?: boolean;
  statusText?: string;
}

export function DashboardHeader({ 
  title = "I3M Platform Overview  ",
  description = "Comprehensive enterprise management dashboard",
  showStatus = true,
  statusText = "Hot Reload Working! 🔥"
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
      <div>
        <h1 className="text-xl sm:text-xl lg:text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">
          {description}
        </p>
      </div>
      {showStatus && (
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            {statusText}
          </Badge>
        </div>
      )}
    </div>
  );
}
